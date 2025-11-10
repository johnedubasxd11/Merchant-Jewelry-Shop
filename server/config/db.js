const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Global variable to track if we're using fallback data
let usingFallback = false;

// In-memory data store for fallback
const fallbackData = {
  users: [],
  products: [],
  orders: []
};

// Load fallback data from JSON files
const loadFallbackData = () => {
  try {
    const dataDir = path.join(__dirname, '../data');

    // Load users (supports both array-only file and consolidated object)
    const usersPath = path.join(dataDir, 'users.json');
    if (fs.existsSync(usersPath)) {
      const parsed = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      if (Array.isArray(parsed)) {
        fallbackData.users = parsed;
      } else {
        if (Array.isArray(parsed.users)) {
          fallbackData.users = parsed.users;
        }
        if (Array.isArray(parsed.products)) {
          fallbackData.products = parsed.products;
        }
        if (Array.isArray(parsed.orders)) {
          fallbackData.orders = parsed.orders;
        }
      }
    }

    // Load products (if separate file exists)
    const productsPath = path.join(dataDir, 'products.json');
    if (fs.existsSync(productsPath)) {
      const parsed = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      if (Array.isArray(parsed)) {
        fallbackData.products = parsed;
      } else if (Array.isArray(parsed.products)) {
        fallbackData.products = parsed.products;
      }
    }

    // Load orders (if separate file exists)
    const ordersPath = path.join(dataDir, 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const parsed = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
      if (Array.isArray(parsed)) {
        fallbackData.orders = parsed;
      } else if (Array.isArray(parsed.orders)) {
        fallbackData.orders = parsed.orders;
      }
    }

    console.log('Fallback data loaded successfully');
  } catch (error) {
    console.error(`Error loading fallback data: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not provided in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    usingFallback = false;
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.log('Switching to fallback data mode');
      usingFallback = true;
      loadFallbackData();
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, switching to fallback data');
      usingFallback = true;
      loadFallbackData();
    });
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Using fallback data instead of MongoDB');
    
    // Load fallback data
    loadFallbackData();
    usingFallback = true;
  }
};

// Export the connection function and fallback data
module.exports = {
  connectDB,
  getFallbackData: () => fallbackData,
  isUsingFallback: () => usingFallback
};