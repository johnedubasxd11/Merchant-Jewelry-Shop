# Frontend Documentation

This document provides comprehensive documentation for the frontend of the Elegant Jewelry Store application.

## Architecture Overview

The frontend is built with React 19 and Vite, utilizing modern React patterns and best practices.

### Technology Stack
- **React 19**: Modern functional components with hooks
- **Vite**: Fast build tool and development server
- **React Context**: Global state management
- **CSS Modules**: Component-scoped styling
- **React Testing Library**: Component testing
- **Vitest**: Test runner and framework

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── ...
├── views/              # Page-level components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/           # API service layer
│   ├── api.js         # Main API service
│   └── auth.js        # Legacy auth service (deprecated)
├── state/              # Global state management
│   └── AppState.js     # Main context provider
├── test/               # Test files
│   ├── setup.js        # Test configuration
│   ├── AppState.test.js
│   └── api.test.js
└── utils/              # Utility functions
    └── validators.js   # Input validation helpers
```

## State Management

### AppState Context

The application uses React Context for global state management. The `AppState` context provides:

#### State Structure
```javascript
{
  user: {
    id: string,
    email: string,
    name: string,
    token: string
  },
  cart: [
    {
      id: string,
      product: object,
      quantity: number
    }
  ],
  orders: [array of order objects],
  wishlist: [array of product objects],
  profile: object,
  isAuthenticated: boolean,
  loading: boolean,
  error: string
}
```

#### Available Actions

**Authentication Actions**
- `login(email, password)`: Authenticate user
- `logout()`: Logout current user
- `checkSession()`: Verify and restore session

**Cart Actions**
- `addToCart(product, quantity)`: Add item to cart
- `removeFromCart(productId)`: Remove item from cart
- `updateCartItemQuantity(productId, quantity)`: Update item quantity
- `clearCart()`: Clear all items from cart

**Order Actions**
- `placeOrder(orderData)`: Create new order
- `getOrders()`: Fetch user orders

**Profile Actions**
- `updateUserProfile(profileData)`: Update user profile

**Wishlist Actions**
- `addToWishlist(product)`: Add to wishlist
- `removeFromWishlist(productId)`: Remove from wishlist
- `isInWishlist(productId)`: Check if item is in wishlist

## Services

### API Service (`services/api.js`)

The main API service handles all HTTP requests with automatic fallback support.

#### Features
- **Automatic Fallback**: Uses local storage when backend is unavailable
- **Error Handling**: Consistent error handling and user feedback
- **Token Management**: Automatic JWT token handling
- **Request/Response Interceptors**: Centralized request processing

#### Available Methods

**Authentication**
- `login(credentials)`: User login
- `register(userData)`: User registration
- `logout()`: User logout
- `getProfile()`: Get user profile

**Products**
- `getProducts(filters)`: Get all products
- `getProductById(id)`: Get single product

**Orders**
- `createOrder(orderData)`: Create order
- `getOrders()`: Get user orders
- `getOrderById(id)`: Get specific order
- `updateOrderToPaid(id)`: Mark order as paid

**User Data**
- `getUserData()`: Get user data from local storage
- `saveUserData(data)`: Save user data to local storage

### Legacy Auth Service (`services/auth.js`)

⚠️ **DEPRECATED**: This service is deprecated and should not be used. All authentication should go through the API service.

## Components

### Layout Components

**Header Component**
- Navigation menu
- User authentication status
- Cart indicator
- Search functionality

**Footer Component**
- Company information
- Quick links
- Social media links

### Product Components

**ProductCard Component**
- Product image and details
- Add to cart functionality
- Wishlist toggle
- Price display

**ProductDetail Component**
- Full product information
- Image gallery
- Quantity selector
- Add to cart form
- Product specifications

### Cart Components

**Cart Component**
- Cart items list
- Quantity controls
- Remove items
- Order summary
- Checkout button

### Authentication Components

**Login Component**
- Email and password fields
- Form validation
- Error handling
- Redirect on success

**Register Component**
- User registration form
- Password strength indicator
- Email validation
- Terms acceptance

## Views (Pages)

### Home Page (`views/Home.jsx`)
- Hero section
- Featured products
- Category navigation
- Newsletter signup

### Products Page (`views/Products.jsx`)
- Product grid/list view
- Category filtering
- Search functionality
- Sort options
- Pagination

### Product Detail Page (`views/ProductDetail.jsx`)
- Product information
- Image gallery
- Add to cart
- Related products
- Reviews (if implemented)

### Cart Page (`views/Cart.jsx`)
- Cart contents
- Quantity management
- Order summary
- Proceed to checkout

### Checkout Page (`views/Checkout.jsx`)
- Shipping information
- Order review
- Payment method selection
- Order confirmation

### Orders Page (`views/Orders.jsx`)
- Order history
- Order status
- Order details
- Reorder functionality

### Authentication Pages
- Login page
- Register page
- Password reset (if implemented)

## Styling

### CSS Approach
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Consistent theming
- **Utility Classes**: Reusable styling patterns

### Theme Variables
```css
:root {
  --primary-color: #d4af37;
  --secondary-color: #1a1a1a;
  --accent-color: #f4f4f4;
  --text-color: #333;
  --border-radius: 4px;
  --box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## Testing

### Test Setup

The frontend uses Vitest with React Testing Library for comprehensive testing.

#### Test Configuration (`test/setup.js`)
- **Mock localStorage**: Simulates browser storage
- **Mock fetch**: Simulates API calls
- **Mock window.location**: Simulates navigation
- **Console suppression**: Reduces test output noise

#### Running Tests
```bash
npm test                 # Run all tests
npm run test:ui         # Interactive test UI
npm run test:coverage   # With coverage report
```

### Test Categories

**Component Tests**
- Unit tests for individual components
- Props validation
- Event handling
- State management

**Integration Tests**
- Component interaction
- API service integration
- State context testing
- Error handling

**Service Tests**
- API endpoint testing
- Fallback behavior
- Error scenarios
- Local storage operations

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Vendor bundle optimization

### Image Optimization
- Responsive images
- Lazy loading
- WebP format support
- Proper alt attributes

### State Optimization
- Memoization with React.memo
- useMemo and useCallback hooks
- Context optimization
- Local state management

## Accessibility

### ARIA Labels
- Proper labeling for screen readers
- Role attributes
- State announcements

### Keyboard Navigation
- Tab order optimization
- Keyboard shortcuts
- Focus management

### Color Contrast
- WCAG 2.1 compliance
- Sufficient contrast ratios
- Color-blind friendly palette

## Browser Support

### Modern Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Progressive Enhancement
- Graceful degradation
- Feature detection
- Polyfills for older browsers

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Consistent naming conventions
- Proper prop types (if using TypeScript)

### Component Guidelines
- Keep components small and focused
- Use composition over inheritance
- Implement proper error boundaries
- Add loading states

### State Management Guidelines
- Use local state for component-specific data
- Use context for global application state
- Avoid prop drilling
- Implement proper cleanup

## Deployment

### Build Process
```bash
npm run build    # Create production build
npm run preview  # Preview production build
```

### Environment Variables
```bash
VITE_API_URL=https://api.yourdomain.com
```

### Static Hosting
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Performance Monitoring
- Bundle size analysis
- Lighthouse scores
- Core Web Vitals
- Error tracking