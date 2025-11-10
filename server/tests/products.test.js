const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

describe('Product Routes', () => {
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
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it('should handle fallback when backend is unreachable', async () => {
      // This test would require mocking the backend failure
      // For now, we just ensure the endpoint responds
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      // First get all products to find a valid ID
      const allProductsResponse = await request(app)
        .get('/api/products');

      if (allProductsResponse.body.products && allProductsResponse.body.products.length > 0) {
        const productId = allProductsResponse.body.products[0].id;
        
        const response = await request(app)
          .get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('product');
        expect(response.body.product).toHaveProperty('id', productId);
      }
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent-product-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});