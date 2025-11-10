const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const { validateOrder } = require('../middleware/validation');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user ID to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Get current user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    const normalized = orders.map((o) => ({
      id: o._id,
      orderItems: o.orderItems,
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      deliveryFee: o.deliveryFee || 0,
      payment: { method: o.paymentMethod },
      itemsPrice: o.itemsPrice,
      taxPrice: o.taxPrice,
      shippingPrice: o.shippingPrice,
      totalPrice: o.totalPrice,
      isPaid: o.isPaid,
      paidAt: o.paidAt,
      isDelivered: o.isDelivered,
      deliveredAt: o.deliveredAt,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }));
    res.json({ orders: normalized });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' }); 
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new order
router.post('/', protect, validateOrder, async (req, res) => {
  try {
    const body = req.body;
    const incomingItems = Array.isArray(body.items) ? body.items : body.orderItems || [];
    const orderItems = incomingItems.map((i) => ({
      name: i.name || i.productName || 'Item',
      qty: Number.isInteger(i.qty) ? i.qty : i.quantity,
      image: i.image,
      price: i.price,
      product: (() => {
        const val = i.product || i.productId;
        if (val && mongoose.Types.ObjectId.isValid(val)) return val;
        return new mongoose.Types.ObjectId();
      })(),
    }));
    const shippingAddress = {
      address: body.shippingAddress?.address || body.shippingAddress?.street,
      city: body.shippingAddress?.city,
      postalCode: body.shippingAddress?.postalCode || body.shippingAddress?.zipCode,
      country: body.shippingAddress?.country || 'Unknown'
    };
  // Accept payment.method or paymentMethod, and optional deliveryFee
  const paymentMethod = (body.payment && body.payment.method) || body.paymentMethod || 'unknown';
  const itemsPrice = body.itemsPrice ?? body.totalAmount ?? orderItems.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const taxPrice = body.taxPrice ?? 0;
  const shippingPrice = body.shippingPrice ?? 0;
  const deliveryFee = Number(body.deliveryFee ?? body.delivery_fee ?? 0) || 0;
  const totalPrice = body.totalPrice ?? (itemsPrice + taxPrice + shippingPrice + deliveryFee);
    
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }
    
    const order = new Order({
      orderItems,
      user: req.userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      deliveryFee,
      totalPrice
    });
    
    const createdOrder = await order.save();
    const normalized = {
      id: createdOrder._id,
      orderItems: createdOrder.orderItems,
      shippingAddress: createdOrder.shippingAddress,
  paymentMethod: createdOrder.paymentMethod,
  payment: { method: createdOrder.paymentMethod },
  deliveryFee: createdOrder.deliveryFee,
      itemsPrice: createdOrder.itemsPrice,
      taxPrice: createdOrder.taxPrice,
      shippingPrice: createdOrder.shippingPrice,
      totalPrice: createdOrder.totalPrice,
      isPaid: createdOrder.isPaid,
      paidAt: createdOrder.paidAt,
      isDelivered: createdOrder.isDelivered,
      deliveredAt: createdOrder.deliveredAt,
      createdAt: createdOrder.createdAt,
      updatedAt: createdOrder.updatedAt,
    };
    res.status(201).json({ order: normalized });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order) {
      const normalized = {
        id: order._id,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
    payment: { method: order.paymentMethod },
    deliveryFee: order.deliveryFee || 0,
        itemsPrice: order.itemsPrice,
        taxPrice: order.taxPrice,
        shippingPrice: order.shippingPrice,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
      res.json({ order: normalized });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update order to paid
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      };
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
