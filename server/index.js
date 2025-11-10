const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Only connect DB and start server when not running tests
const IS_TEST = process.env.NODE_ENV === 'test';
if (!IS_TEST) {
  connectDB();
}

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Merchant backend running' });
});

// In test environment, export the app without starting the listener
if (!IS_TEST) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
