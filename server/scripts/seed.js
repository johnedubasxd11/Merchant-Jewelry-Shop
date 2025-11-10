const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load backend .env explicitly
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

function mapProduct(p) {
  const image = p.imageUrl || '/images/placeholder.jpg';
  const details = p.details || {};
  const descriptionParts = [];
  if (details.material) descriptionParts.push(details.material);
  if (details.gemstone) descriptionParts.push(`Gemstone: ${details.gemstone}`);
  if (details.style) descriptionParts.push(`Style: ${details.style}`);
  const description = descriptionParts.length
    ? descriptionParts.join(' | ')
    : `${p.name} — Premium handcrafted jewelry`;

  const numReviews = Array.isArray(p.reviews) ? p.reviews.length : 0;
  const rating = numReviews
    ? p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / numReviews
    : 0;

  return {
    name: p.name,
    image,
    brand: 'Aurora Atelier',
    category: p.category || 'Jewelry',
    description,
    reviews: [], // Not mapping sample reviews to schema (requires user ref)
    rating,
    numReviews,
    price: p.price || 0,
    countInStock: 25,
  };
}

async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set. Please set it in server/.env');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    const dataPath = path.join(__dirname, '..', 'data', 'products.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const json = JSON.parse(raw);

    const items = Array.isArray(json.products) ? json.products : json;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No products found in data file');
    }

    const docs = items.map(mapProduct);

    await Product.deleteMany({});
    const result = await Product.insertMany(docs);

    console.log(`Seeded ${result.length} products.`);
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    console.error(err);
    try { await mongoose.connection.close(); } catch (_) {}
    process.exit(1);
  }
}

seed();