
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api.js';

const TOKEN_KEY = 'auth_token';

const AppContext = createContext(undefined);

export const AppStateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY); } catch (_) { return null; }
  });

  // User-specific data
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  const clearUserData = () => {
    setCart([]);
    setOrders([]);
    setWishlist([]);
    setUserProfile(null);
    setLastPlacedOrder(null);
  };

  const loadUserData = useCallback(async (user) => {
    try {
      const id = user.id || user.email;
      const data = await api.getUserData(id);
      setCart(data.cart || []);
      setOrders(data.orders || []);
      setWishlist(data.wishlist || []);
      setUserProfile(data.profile || null);
    } catch (error) {
      console.error("Failed to load user data", error);
      // If data load fails, log them out to be safe
      logout();
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      // Use token-based session only
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          setToken(storedToken);
          const profile = await api.getProfile();
          setCurrentUser(profile);
          setIsAuthenticated(true);
          setUserProfile(profile);
          // Load orders from backend
          try {
            const remoteOrders = await api.getOrders();
            setOrders(remoteOrders || []);
          } catch (ordersErr) {
            console.warn('Could not load orders from backend', ordersErr.message);
          }
          await loadUserData(profile);
        } catch (err) {
          console.warn('Invalid token or backend unreachable during session check', err.message);
          clearUserData();
        }
      } else {
        clearUserData();
      }
      setIsLoading(false);
    };
    checkSession();
  }, [loadUserData]);
  
  const persistUserData = useCallback(async () => {
    if (!currentUser) return;
    const id = currentUser.id || currentUser.email;
    const userData = { profile: userProfile, cart, wishlist, orders };
    try {
      await api.saveUserData(id, userData);
    } catch (err) {
      console.warn('Failed to persist user data to backend/localStorage', err.message);
    }
  }, [currentUser, userProfile, cart, wishlist, orders]);
  
  useEffect(() => {
    // This effect will persist data whenever it changes.
    // In a real app, you'd call the API on each specific action instead.
    if (!isLoading && isAuthenticated) {
        persistUserData();
    }
  }, [cart, wishlist, orders, userProfile, isLoading, isAuthenticated, persistUserData]);

  const login = async (identifier, password) => {
    // Use backend auth only
    try {
      const { token: newToken, profile } = await api.login(identifier, password);
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      }
      const user = profile || { id: profile?.email || identifier, email: profile?.email || identifier };
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserProfile(profile || null);
      await loadUserData(user);
      // load orders from backend if token
      try {
        const remoteOrders = await api.getOrders();
        setOrders(remoteOrders || []);
      } catch (err) {
        console.warn('Failed to load remote orders after login', err.message);
      }
      return user;
    } catch (err) {
      // If authentication explicitly failed, propagate error to UI
      if (err && err.message === 'Authentication failed') {
        throw err;
      }
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { token: newToken, profile } = await api.register(name, email, password);
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      }
      const user = profile || { id: email, email, name };
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserProfile(profile || { name, email });
      await loadUserData(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const socialLogin = async (socialUser) => {
    try {
      // Use backend API for social login; falls back if unreachable
      const { token: newToken, profile } = await api.socialLogin(socialUser);
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      }
      const user = profile || { id: socialUser.email, email: socialUser.email, name: socialUser.name };
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserProfile(profile || { name: socialUser.name, email: socialUser.email });
      await loadUserData(user);
      // load orders from backend if token
      try {
        const remoteOrders = await api.getOrders();
        setOrders(remoteOrders || []);
      } catch (err) {
        console.warn('Failed to load remote orders after social login', err.message);
      }
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    // Remove token only
    try { localStorage.removeItem(TOKEN_KEY); setToken(null); } catch (_) {}
    api.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    clearUserData();
    window.location.hash = '/';
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  // placeOrder now accepts paymentInfo: { method: 'visa'|'mastercard'|'gcash'|'paymaya'|'paypal'|'cod', details?: {} }
  const placeOrder = async (paymentInfo = {}) => {
    if (cart.length === 0) return null;
    // base subtotal and shipping
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 15 : 0;

    // compute COD fee when applicable (between 25 and 30 inclusive)
    let codFee = 0;
    if ((paymentInfo.method || '').toLowerCase() === 'cod') {
      codFee = 25 + Math.floor(Math.random() * 6); // 25..30
    }

    const total = subtotal + shipping + codFee;

    const newOrder = {
      items: [...cart],
      subtotal,
      shipping,
      deliveryFee: codFee,
      payment: paymentInfo,
      total,
      customerEmail: userProfile?.email || currentUser?.email || null
    };

    try {
      const saved = await api.createOrder(newOrder);
      // normalize saved order to include date if backend returned none
      const orderToStore = {
        id: saved.id || `order-${Date.now()}`,
        date: saved.date || new Date().toISOString(),
        items: saved.items || newOrder.items,
        subtotal: saved.subtotal || newOrder.subtotal,
        shipping: saved.shipping || newOrder.shipping,
        deliveryFee: saved.deliveryFee || newOrder.deliveryFee,
        payment: saved.payment || newOrder.payment,
        total: saved.total || newOrder.total
      };
      setOrders(prevOrders => [orderToStore, ...prevOrders]);
      setLastPlacedOrder(orderToStore);
      clearCart();
      return orderToStore;
    } catch (err) {
      console.error('Failed to place order', err);
      return null;
    }
  };

  const updateUserProfile = (profile) => {
    setUserProfile(profile);
  };

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => [...prevWishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const value = { 
    currentUser, 
    isAuthenticated,
    isLoading,
    login,
    register,
    socialLogin,
    logout,
    cart, 
    orders, 
    lastPlacedOrder, 
    userProfile, 
    wishlist, 
    addToCart, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart, 
    placeOrder, 
    updateUserProfile, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist 
  };

  // Render children only after checking session to avoid flicker
  return React.createElement(AppContext.Provider, { value: value }, !isLoading && children);
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
