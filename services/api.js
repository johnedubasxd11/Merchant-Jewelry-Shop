
// API service for making requests to the backend
import { products as staticProducts } from '../data/products.js';

// Read API base from Vite env, fallback to current backend port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper: get stored token
const getStoredToken = () => localStorage.getItem('auth_token');

// Centralized fetch wrapper that injects Authorization header when token exists
async function tryFetch(url, opts = {}) {
  const token = getStoredToken();
  const headers = Object.assign({}, opts.headers || {});
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const merged = Object.assign({}, opts, { headers });

  const res = await fetch(url, merged);
  const contentType = res.headers.get('content-type') || '';

  // try parse JSON when present
  let body = null;
  if (contentType.includes('application/json')) {
    try { body = await res.json(); } catch (_) { body = null; }
  } else {
    try { body = await res.text(); } catch (_) { body = null; }
  }

  if (!res.ok) {
    const message = (body && body.message) || body || `HTTP ${res.status}`;
    const err = new Error(String(message));
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body === null ? res : body;
}

// Get all products
export const getProducts = async () => {
  try {
    const data = await tryFetch(`${API_URL}/products`);
    return data.products || data;
  } catch (err) {
    console.warn('getProducts: backend unreachable, falling back to static products', err.message);
    return [...staticProducts];
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    return await tryFetch(`${API_URL}/products/${id}`);
  } catch (err) {
    console.warn('getProduct: backend unreachable, falling back to static product', err.message);
    const product = staticProducts.find(p => p.id === id);
    if (!product) throw new Error(`Product with id ${id} not found.`);
    return { ...product };
  }
};

// Login user - stores token + profile on success
export const login = async (email, password) => {
  try {
    const data = await tryFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.user || data.profile) {
      localStorage.setItem('userInfo', JSON.stringify(data.user || data.profile));
    }
    return data;
  } catch (err) {
    console.warn('login: backend unreachable or failed', err.message);
    // offline/mock fallback
    const token = btoa(email);
    const fallback = { token, profile: { name: email.split('@')[0], email } };
    localStorage.setItem('auth_token', token);
    localStorage.setItem('userInfo', JSON.stringify(fallback.profile));
    return fallback;
  }
};

// Signup (create account)
export const signup = async (name, email, password) => {
  try {
    const data = await tryFetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) localStorage.setItem('auth_token', data.token);
    if (data.user || data.profile) localStorage.setItem('userInfo', JSON.stringify(data.user || data.profile));
    return data;
  } catch (err) {
    console.warn('signup failed', err.message);
    throw err;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('userInfo');
};

// Get user profile
export const getProfile = async () => {
  try {
    return await tryFetch(`${API_URL}/auth/profile`);
  } catch (err) {
    console.warn('getProfile: backend unreachable or invalid token, returning mock profile', err.message);
    try {
      const t = getStoredToken();
      const email = atob(t);
      return { name: email.split('@')[0], email };
    } catch (_) {
      throw new Error('Not authenticated');
    }
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    return await tryFetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
  } catch (err) {
    console.warn('createOrder: backend unreachable, saving to localStorage', err.message);
    const ordersKey = 'local_orders';
    const existing = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const id = `o${Date.now()}`;
    const toSave = { id, date: new Date().toISOString(), ...orderData };
    existing.push(toSave);
    localStorage.setItem(ordersKey, JSON.stringify(existing));
    return toSave;
  }
};

// Get user orders
export const getOrders = async () => {
  try {
    return await tryFetch(`${API_URL}/orders`);
  } catch (err) {
    console.warn('getOrders: backend unreachable, reading from localStorage', err.message);
    return JSON.parse(localStorage.getItem('local_orders') || '[]');
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    return await tryFetch(`${API_URL}/orders/${id}`);
  } catch (err) {
    throw err;
  }
};

// Update order to paid
export const updateOrderToPaid = async (id, paymentResult) => {
  try {
    return await tryFetch(`${API_URL}/orders/${id}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentResult),
    });
  } catch (err) {
    throw err;
  }
};

export const getUserData = async (userId) => {
  try {
    const storedData = localStorage.getItem(`userData_${userId}`);
    if (storedData) return JSON.parse(storedData);
    const fallback = { profile: { name: userId, email: userId }, cart: [], wishlist: [], orders: [] };
    localStorage.setItem(`userData_${userId}`, JSON.stringify(fallback));
    return fallback;
  } catch (err) {
    throw err;
  }
};

export const saveUserData = async (userId, data) => {
  try {
    localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
    return true;
  } catch (err) {
    throw err;
  }
};

// Social login via backend (keeps previous fallback behavior)
export const socialLogin = async (socialUser) => {
  try {
    const data = await tryFetch(`${API_URL}/auth/social-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: socialUser.provider,
        accessToken: socialUser.token || 'mock_access_token',
        userData: {
          id: socialUser.providerId || socialUser.id,
          name: socialUser.name,
          email: socialUser.email,
          avatar: socialUser.avatar,
        },
      }),
    });
    if (data.token) localStorage.setItem('auth_token', data.token);
    const profile = data.user || data.profile;
    if (profile) localStorage.setItem('userInfo', JSON.stringify(profile));
    return { token: data.token, profile };
  } catch (err) {
    console.warn('socialLogin: backend unreachable, falling back to simulated login', err.message);
    const token = socialUser.token || `social_${Date.now()}`;
    const profile = { name: socialUser.name, email: socialUser.email };
    localStorage.setItem('auth_token', token);
    localStorage.setItem('userInfo', JSON.stringify(profile));
    return { token, profile };
  }
};
