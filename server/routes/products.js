const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const { isUsingFallback, getFallbackData } = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isUsingFallback()) {
      // Use fallback data if MongoDB is not available
      const products = getFallbackData().products;
      return res.json({ products });
    }
    
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    // Fallback to static data if query fails
    const products = getFallbackData().products;
    res.json({ products });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    // In fallback mode, return product from fallback data by id
    if (isUsingFallback()) {
      const products = getFallbackData().products || [];
      const product = products.find(p => String(p.id) === String(req.params.id));
      if (product) {
        return res.json({ product });
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a product (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, category, imageUrl, details } = req.body;

    if (isUsingFallback()) {
      // In fallback mode, we can't add to the database,
      // so we'll just return a success message.
      // A more robust solution would be to write to the JSON file.
      console.log('Fallback mode: Product creation skipped.');
      return res.status(201).json({
        name,
        price,
        category,
        imageUrl,
        details,
        _id: `fallback_${Date.now()}`,
      });
    }

    const product = new Product({
      name,
      price,
      category,
      imageUrl,
      details,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
