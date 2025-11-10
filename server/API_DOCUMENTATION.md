# Backend API Documentation

This document provides comprehensive documentation for the backend API of the Elegant Jewelry Store application.

## Base URL

- Development: `http://localhost:4000/api`
- Production: `https://your-domain.com/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
  ```
- **Error Responses**:
  - 400: Invalid email format, weak password, or missing fields
  - 409: Email already exists

#### Login User
- **POST** `/auth/login`
- **Description**: Authenticate user and return JWT token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
  ```
- **Error Responses**:
  - 400: Invalid credentials
  - 401: Authentication failed

#### Logout User
- **POST** `/auth/logout`
- **Description**: Logout user (clears session)
- **Headers**: Authorization: Bearer <token>
- **Success Response**: 200 OK
  ```json
  {
    "message": "Logout successful"
  }
  ```

#### Get User Profile
- **GET** `/auth/profile`
- **Description**: Get current user profile
- **Headers**: Authorization: Bearer <token>
- **Success Response**: 200 OK
  ```json
  {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized (invalid or missing token)

#### Change Password
- **PUT** `/auth/change-password`
- **Description**: Change user password
- **Headers**: Authorization: Bearer <token>
- **Body**:
  ```json
  {
    "currentPassword": "OldPass123!",
    "newPassword": "NewSecurePass456!"
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "message": "Password changed successfully"
  }
  ```
- **Error Responses**:
  - 400: Invalid current password or weak new password
  - 401: Unauthorized

### Products

#### Get All Products
- **GET** `/products`
- **Description**: Get all available products
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `search` (optional): Search term
  - `sort` (optional): Sort field (price, name, createdAt)
  - `order` (optional): Sort order (asc, desc)
- **Success Response**: 200 OK
  ```json
  {
    "products": [
      {
        "id": "product-id",
        "name": "Gold Necklace",
        "description": "Beautiful 18k gold necklace",
        "price": 299.99,
        "category": "necklaces",
        "image": "/images/gold-necklace.jpg",
        "stock": 10,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  }
  ```

#### Get Product by ID
- **GET** `/products/:id`
- **Description**: Get single product details
- **Success Response**: 200 OK
  ```json
  {
    "product": {
      "id": "product-id",
      "name": "Gold Necklace",
      "description": "Beautiful 18k gold necklace",
      "price": 299.99,
      "category": "necklaces",
      "image": "/images/gold-necklace.jpg",
      "stock": 10,
      "specifications": {
        "material": "18k Gold",
        "weight": "15g",
        "length": "45cm"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 404: Product not found

### Orders

#### Create Order
- **POST** `/orders`
- **Description**: Create a new order
- **Headers**: Authorization: Bearer <token>
- **Body**:
  ```json
  {
    "items": [
      {
        "productId": "product-id",
        "quantity": 2,
        "price": 299.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "totalAmount": 599.98
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "id": "order-id",
      "userId": "user-id",
      "items": [...],
      "shippingAddress": {...},
      "totalAmount": 599.98,
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid order data or empty items
  - 401: Unauthorized

#### Get User Orders
- **GET** `/orders`
- **Description**: Get all orders for current user
- **Headers**: Authorization: Bearer <token>
- **Success Response**: 200 OK
  ```json
  {
    "orders": [
      {
        "id": "order-id",
        "items": [...],
        "shippingAddress": {...},
        "totalAmount": 599.98,
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get Order by ID
- **GET** `/orders/:id`
- **Description**: Get specific order details
- **Headers**: Authorization: Bearer <token>
- **Success Response**: 200 OK
  ```json
  {
    "order": {
      "id": "order-id",
      "userId": "user-id",
      "items": [...],
      "shippingAddress": {...},
      "totalAmount": 599.98,
      "status": "pending",
      "paymentStatus": "unpaid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 404: Order not found
  - 403: Access denied (not your order)

#### Update Order to Paid
- **PUT** `/orders/:id/pay`
- **Description**: Mark order as paid (admin only)
- **Headers**: Authorization: Bearer <token>
- **Success Response**: 200 OK
  ```json
  {
    "message": "Order marked as paid",
    "order": {
      "id": "order-id",
      "paymentStatus": "paid",
      "status": "processing"
    }
  }
  ```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error
- `DATABASE_ERROR`: Database operation failed

## Validation Rules

### Email Validation
- Must be valid email format
- Must be unique in the system

### Password Requirements
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character

### Product Validation
- Name: Required, 3-100 characters
- Description: Required, 10-1000 characters
- Price: Required, positive number
- Stock: Required, non-negative integer

### Order Validation
- Must have at least one item
- Total amount must match calculated sum
- Shipping address must be complete

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Order creation**: 10 requests per minute per user

## Fallback Behavior

When the backend is unreachable, the frontend will:

1. **Authentication**: Use local storage with mock data
2. **Products**: Load from static JSON files
3. **Orders**: Store in local storage
4. **User Data**: Persist in browser local storage

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configured for specific origins
3. **Input Sanitization**: All inputs are sanitized
4. **SQL Injection**: Protected by MongoDB/Mongoose
5. **XSS Protection**: Headers configured
6. **Rate Limiting**: Implemented on all endpoints

## Development Notes

### Database Schema

**User Model**
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Product Model**
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  image: String,
  stock: Number (default: 0),
  specifications: Object,
  createdAt: Date,
  updatedAt: Date
}
```

**Order Model**
```javascript
{
  userId: ObjectId (required),
  items: [{
    productId: ObjectId (required),
    quantity: Number (required),
    price: Number (required)
  }],
  shippingAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required)
  },
  totalAmount: Number (required),
  status: String (default: 'pending'),
  paymentStatus: String (default: 'unpaid'),
  createdAt: Date,
  updatedAt: Date
}
```

### Testing

The API includes comprehensive test coverage:

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Validation Tests**: Input validation testing
- **Error Handling Tests**: Error scenario testing

Run tests with: `npm test` in the server directory.