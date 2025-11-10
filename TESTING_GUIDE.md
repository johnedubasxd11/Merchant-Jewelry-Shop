# Testing Guide

This guide provides comprehensive information about the testing setup and practices for the Elegant Jewelry Store application.

## Overview

The application has full test coverage for both frontend and backend components:

- **Backend**: Jest with Supertest for API testing
- **Frontend**: Vitest with React Testing Library for component testing
- **Integration**: End-to-end testing capabilities

## Backend Testing

### Setup

Backend tests are located in `server/tests/` and use Jest with Supertest.

#### Configuration (`server/jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
```

#### Test Environment (`server/tests/setup.js`)
```javascript
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long';
process.env.MONGO_URI = 'mongodb://localhost:27017/jewelry_store_test';
process.env.PORT = '4001';

// Mock console methods to reduce test output
console.log = jest.fn();
console.error = jest.fn();
```

### Test Categories

#### Authentication Tests (`server/tests/auth.test.js`)

**Registration Tests**
- ✅ Successful user registration
- ✅ Rejection of invalid email format
- ✅ Rejection of weak passwords
- ✅ Rejection of duplicate emails

**Login Tests**
- ✅ Successful login with valid credentials
- ✅ Rejection of invalid password
- ✅ Rejection of non-existent user

**Password Change Tests**
- ✅ Successful password change
- ✅ Rejection of invalid current password
- ✅ Rejection of weak new password

#### Order Tests (`server/tests/orders.test.js`)

**Order Creation Tests**
- ✅ Successful order creation
- ✅ Rejection of orders with empty items
- ✅ Rejection of invalid shipping addresses

**Order Retrieval Tests**
- ✅ Successful retrieval of user orders
- ✅ Authentication requirement for order access
- ✅ Successful retrieval of order by ID
- ✅ Rejection of access to non-existent orders

#### Product Tests (`server/tests/products.test.js`)

**Product Retrieval Tests**
- ✅ Successful retrieval of all products
- ✅ Handling of backend unreachability
- ✅ Successful retrieval of product by ID
- ✅ Proper handling of non-existent products

### Running Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js

# Run tests with verbose output
npm test -- --verbose
```

## Frontend Testing

### Setup

Frontend tests are located in `src/test/` and use Vitest with React Testing Library.

#### Configuration (`vitest.config.js`)
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/'],
    },
  },
});
```

#### Test Environment (`src/test/setup.js`)
```javascript
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
global.window = {
  ...global.window,
  location: {
    href: '',
    pathname: '',
    reload: vi.fn(),
  },
};

// Mock fetch
global.fetch = vi.fn();

// Mock console methods
console.log = vi.fn();
console.error = vi.fn();
```

### Test Categories

#### AppState Context Tests (`src/test/AppState.test.js`)

**Authentication Tests**
- ✅ Initial authentication state
- ✅ Login functionality
- ✅ Logout functionality
- ✅ Session restoration

**Cart Management Tests**
- ✅ Adding items to cart
- ✅ Removing items from cart
- ✅ Updating item quantities
- ✅ Cart persistence

**Error Handling Tests**
- ✅ Error handling when used outside provider
- ✅ Error boundary functionality

#### API Service Tests (`src/test/api.test.js`)

**Authentication API Tests**
- ✅ Successful login
- ✅ Failed login with invalid credentials
- ✅ Fallback behavior when backend unreachable

**Logout API Tests**
- ✅ Successful logout
- ✅ Clearing authentication data

**Profile API Tests**
- ✅ Successful profile retrieval
- ✅ Authentication requirement

**Product API Tests**
- ✅ Successful product retrieval
- ✅ Fallback when backend unreachable
- ✅ Single product retrieval
- ✅ Handling of non-existent products

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test AppState.test.js

# Run tests in watch mode
npm test -- --watch
```

## Test Best Practices

### Backend Testing

1. **Test Isolation**: Each test should be independent
2. **Database Cleanup**: Clean up test data after tests
3. **Mock External Services**: Don't hit real external APIs
4. **Test Edge Cases**: Test boundary conditions
5. **Error Testing**: Test error scenarios, not just success cases

#### Example Backend Test
```javascript
describe('POST /auth/register', () => {
  it('should register a new user with valid data', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      name: 'New User'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(newUser.email);
  });
});
```

### Frontend Testing

1. **Test User Interactions**: Focus on user behavior
2. **Test Accessibility**: Ensure components are accessible
3. **Test Loading States**: Test loading and error states
4. **Test Props**: Test component with different prop combinations
5. **Test Events**: Test user interactions and event handlers

#### Example Frontend Test
```javascript
describe('AppState Context', () => {
  it('should handle login correctly', async () => {
    api.login.mockResolvedValueOnce({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'test-token'
    });

    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.email).toBe('test@example.com');
  });
});
```

## Integration Testing

### End-to-End Testing Setup

For comprehensive E2E testing, consider using:

- **Cypress**: Modern E2E testing framework
- **Playwright**: Cross-browser testing
- **Selenium**: Traditional browser automation

### Recommended E2E Test Scenarios

1. **User Registration Flow**
   - Navigate to register page
   - Fill registration form
   - Submit form
   - Verify successful registration

2. **Product Purchase Flow**
   - Login as user
   - Browse products
   - Add product to cart
   - Proceed to checkout
   - Complete order

3. **Authentication Flow**
   - Login with valid credentials
   - Verify protected routes
   - Logout and verify redirect

## Performance Testing

### Load Testing

Use tools like:
- **Artillery**: For API load testing
- **k6**: Modern load testing tool
- **JMeter**: Traditional load testing

### Frontend Performance

Monitor:
- **Bundle size**: Keep bundles small
- **Core Web Vitals**: LCP, FID, CLS
- **Lighthouse scores**: Performance, accessibility, SEO

## Security Testing

### API Security

Test for:
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Authentication**: Token validation
- **Authorization**: Role-based access
- **Rate Limiting**: Request throttling

### Frontend Security

Test for:
- **XSS Prevention**: Input validation
- **CSRF Protection**: Token validation
- **Secure Storage**: No sensitive data in localStorage
- **HTTPS**: Secure connections

## Continuous Integration

### GitHub Actions Example
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd server && npm install
      
      - name: Run backend tests
        run: cd server && npm test
      
      - name: Run frontend tests
        run: npm test
```

## Debugging Tests

### Backend Debugging
```bash
# Run tests with debugging
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Run specific test with verbose output
npm test -- --verbose --testNamePattern="should register"
```

### Frontend Debugging
```bash
# Run tests with debugging
npm test -- --reporter=verbose

# Run tests in UI mode for debugging
npm run test:ui
```

## Test Coverage Goals

Aim for the following coverage levels:

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep testing libraries current
2. **Fix Flaky Tests**: Address intermittent failures
3. **Add New Tests**: Cover new features
4. **Review Coverage**: Maintain coverage goals
5. **Update Documentation**: Keep docs current

### Best Practices

1. **Write Tests First**: TDD approach
2. **Keep Tests Simple**: One assertion per test
3. **Use Descriptive Names**: Clear test descriptions
4. **Test Edge Cases**: Boundary conditions
5. **Mock External Dependencies**: Isolate units
6. **Run Tests Frequently**: CI/CD integration