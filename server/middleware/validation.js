const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or identifier is required')
    .isLength({ max: 100 })
    .withMessage('Identifier too long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password too long'),
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password'),
  handleValidationErrors
];

// Order validation: support both {items} and legacy {orderItems}
const validateOrder = [
  body().custom((value, { req }) => {
    const items = Array.isArray(req.body.items) ? req.body.items : null;
    const orderItems = Array.isArray(req.body.orderItems) ? req.body.orderItems : null;

    if (!items && !orderItems) {
      throw new Error('Order must contain at least one item');
    }
    const list = items || orderItems;
    if (!list.length) {
      throw new Error('Order must contain at least one item');
    }

    // Quantity checks (supports quantity or qty)
    const quantitiesValid = list.every((i) => {
      const q = Number.isInteger(i.quantity) ? i.quantity : i.qty;
      return Number.isInteger(q) && q >= 1 && q <= 100;
    });
    if (!quantitiesValid) {
      throw new Error('Quantity must be between 1 and 100');
    }

    // Shipping address: support street/zipCode or address/postalCode
    const addr = req.body.shippingAddress || {};
    const streetOrAddress = (addr.street || addr.address || '').trim();
    if (streetOrAddress.length < 5) {
      throw new Error('Shipping address is required');
    }
    const city = (addr.city || '').trim();
    if (city.length < 2) {
      throw new Error('City must be between 2 and 50 characters');
    }
    const zipOrPostal = (addr.zipCode || addr.postalCode || '').toString();
    if (!zipOrPostal || zipOrPostal.length < 4) {
      throw new Error('Please provide a valid postal/ZIP code');
    }
    return true;
  }),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateOrder,
  handleValidationErrors
};