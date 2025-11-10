import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, logout, getProfile, register, getProducts, getProductById } from '../services/api.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await login('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'test@example.com', password: 'password123' })
      });

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('auth_token')).toBe('test-token');
      expect(localStorage.getItem('userInfo')).toBe(JSON.stringify(mockResponse));
    });

    it('should handle login failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should fallback to mock token when backend is unreachable', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await login('test@example.com', 'password123');

      expect(result).toEqual({
        token: btoa('test@example.com'),
        profile: { name: 'test', email: 'test@example.com' }
      });
    });
  });

  describe('logout', () => {
    it('should clear authentication data', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('userInfo', JSON.stringify({ user: 'test' }));

      logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('userInfo')).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockProfile = { id: '1', email: 'test@example.com', name: 'Test User' };
      localStorage.setItem('auth_token', 'test-token');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      const result = await getProfile();

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/profile', {
        headers: { Authorization: 'Bearer test-token' }
      });

      expect(result).toEqual(mockProfile);
    });

    it('should throw error when not authenticated', async () => {
      localStorage.removeItem('auth_token');

      await expect(getProfile()).rejects.toThrow('Not authenticated');
    });
  });

  describe('getProducts', () => {
    it('should get products successfully', async () => {
      const mockProducts = {
        products: [
          { id: '1', name: 'Product 1', price: 99.99 },
          { id: '2', name: 'Product 2', price: 149.99 }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const result = await getProducts();

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/products');
      expect(result).toEqual(mockProducts);
    });

    it('should fallback to static products when backend is unreachable', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getProducts();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getProductById', () => {
    it('should get product by id successfully', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 99.99 };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ product: mockProduct })
      });

      const result = await getProductById('1');

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/products/1');
      expect(result).toEqual({ product: mockProduct });
    });

    it('should fallback to static product when backend is unreachable', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getProductById('1');

      expect(result).toHaveProperty('id', '1');
    });
  });
});