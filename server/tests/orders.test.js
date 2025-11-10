const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

describe('Order Routes', () => {
  let authToken;
  let userId;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    
    // Create and login a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword123!'
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user?.id || registerResponse.body.user?._id || registerResponse.body._id;
  });

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        orderItems: [
          {
            product: 'product123',
            name: 'Test Product',
            image: '/images/test.jpg',
            price: 99.99,
            quantity: 2
          }
        ],
        shippingAddress: {
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        itemsPrice: 199.98,
        taxPrice: 20.00,
        shippingPrice: 15.00,
        totalPrice: 234.98
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id');
      expect(response.body.order.orderItems).toHaveLength(1);
      expect(response.body.order.totalPrice).toBe(234.98);
    });

    it('should reject order with empty items', async () => {
      const orderData = {
        orderItems: [],
        shippingAddress: {
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card',
        itemsPrice: 0,
        taxPrice: 0,
        shippingPrice: 15.00,
        totalPrice: 15.00
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject order with invalid shipping address', async () => {
      const orderData = {
        orderItems: [
          {
            product: 'product123',
            name: 'Test Product',
            image: '/images/test.jpg',
            price: 99.99,
            quantity: 2
          }
        ],
        shippingAddress: {
          address: '',
          city: '',
          postalCode: '',
          country: ''
        },
        paymentMethod: 'credit_card',
        itemsPrice: 199.98,
        taxPrice: 20.00,
        shippingPrice: 15.00,
        totalPrice: 234.98
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create a test order
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderItems: [
            {
              product: 'product123',
              name: 'Test Product',
              image: '/images/test.jpg',
              price: 99.99,
              quantity: 1
            }
          ],
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            postalCode: '12345',
            country: 'Test Country'
          },
          paymentMethod: 'credit_card',
          itemsPrice: 99.99,
          taxPrice: 10.00,
          shippingPrice: 15.00,
          totalPrice: 124.99
        });
    });

    it('should get user orders successfully', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders).toHaveLength(1);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeEach(async () => {
      // Create a test order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderItems: [
            {
              product: 'product123',
              name: 'Test Product',
              image: '/images/test.jpg',
              price: 99.99,
              quantity: 1
            }
          ],
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            postalCode: '12345',
            country: 'Test Country'
          },
          paymentMethod: 'credit_card',
          itemsPrice: 99.99,
          taxPrice: 10.00,
          shippingPrice: 15.00,
          totalPrice: 124.99
        });

      orderId = orderResponse.body.order.id;
    });

    it('should get order by id successfully', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order.id).toBe(orderId);
    });

    it('should reject access to non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/nonexistent-order-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});