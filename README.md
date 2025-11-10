

# Elegant Jewelry Store

A modern, full-stack e-commerce application for jewelry sales with secure authentication, order management, and responsive design.

## 🌟 Features

- **Secure Authentication**: JWT-based authentication with proper validation and error handling
- **Social Login**: Google and Facebook OAuth integration for seamless authentication
- **Product Catalog**: Browse jewelry products with detailed information and images
- **Shopping Cart**: Add/remove items, update quantities, and manage cart state
- **Order Management**: Create and track orders with payment processing
- **Responsive Design**: Mobile-first design that works on all devices
- **Fallback Support**: Graceful degradation when backend is unavailable
- **Input Validation**: Comprehensive validation for all user inputs
- **Testing**: Full test coverage for both frontend and backend

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with modern hooks and context
- **Build Tool**: Vite for fast development and building
- **State Management**: React Context for global state
- **Testing**: Vitest with React Testing Library
- **Styling**: CSS modules and responsive design

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: express-validator and Joi for input validation
- **Testing**: Jest with Supertest for API testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnedubasxd11/Merchant-Jewelry-Shop.git
   cd Merchant-Jewelry-Shop
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create `.env` files for the frontend (optional) and backend. The backend `.env` should live in the `server/` folder.

   **Frontend (optional `./.env`)**
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

   **Backend (`server/.env`)**
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/jewelry_store
   JWT_SECRET=johnedubasxd09911527545-0313
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd server
   npm run dev
   
   # In a new terminal, start frontend
   cd ..
   npm run dev
   ```

5. **Access the application**
   - Frontend: open the URL printed by Vite after `npm run dev` (commonly http://localhost:5173 or another available port)
   - Backend API: http://localhost:4000/api

## 📋 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🔧 Configuration

### Security Configuration
- **JWT Secret**: Must be at least 32 characters long
- **Password Requirements**: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- **Input Validation**: All user inputs are validated using express-validator
- **CORS**: Configured for secure cross-origin requests

### OAuth Configuration
The application supports social login with Google and Facebook. To enable OAuth authentication:

 **Google OAuth Setup:**
 1. Go to `Google Cloud Console` (https://console.cloud.google.com/)
 2. Create a new project or select an existing one
 3. Configure the `OAuth consent screen` (External or Internal)
 4. Create `OAuth 2.0 Client ID` (type: Web application)
 5. Add authorized redirect URI: `http://localhost:4000/api/auth/google/callback`
 6. Copy Client ID and Client Secret

**Facebook OAuth Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:4000/api/auth/facebook/callback`
5. Copy App ID and App Secret

 **Backend Environment Variables:**
 Add these to your `server/.env` file:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

 **Frontend Configuration:**
 The social login buttons are already integrated in the login form and will redirect to the appropriate OAuth providers.

 **Secrets & Safety:**
 - Keep `Client Secret` values in `server/.env`, never in frontend `.env`.
 - Vite prefixes (`VITE_*`) are exposed to the browser; do not store secrets there.
 - Commit only `.env.example` with placeholder values; never commit real secrets.

### Database Configuration
- **MongoDB Connection**: Supports both local and cloud MongoDB instances
- **Fallback Data**: Local JSON files for development when database is unavailable
- **Connection Options**: Proper connection pooling and error handling

## 🧪 Testing

### Running Tests

**Backend Tests**
```bash
cd server
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

**Frontend Tests**
```bash
npm test                 # Run all tests
npm run test:ui         # Interactive UI
npm run test:coverage   # With coverage report
```

### Test Coverage
- **Backend**: Authentication, orders, products, validation middleware
- **Frontend**: State management, API services, components
- **Integration**: API endpoint testing with database

## 📁 Project Structure (actual layout)

This project keeps the frontend files at the repository root (no nested `src/` build folder). Key files and folders in this repository are:

```
Merchant-Jewelry-Shop/
├── App.js, App.tsx, index.js, index.tsx      # Frontend entry and root app files
├── components/                              # React components (Header, Footer, etc.)
├── views/                                   # Page components (HomeView, CartView, CheckoutView...)
├── services/                                # API client (services/api.js)
├── state/                                   # AppState context
├── data/                                    # Static fallback data (products)
├── public/                                  # Static assets
├── server/                                  # Backend source (Express + Mongoose)
│   ├── routes/
│   ├── models/
│   └── ...
├── package.json                              # frontend scripts & deps
└── server/package.json                       # backend scripts & deps
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Proper error messages without exposing system details
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Ready for implementation (recommended for production)

## 🛠️ Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow React best practices for components
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Git Workflow
- Create feature branches for new features
- Use descriptive commit messages
- Test before committing
- Keep commits focused and atomic

### Performance Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use production builds for deployment

## 🚢 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx recommended)
4. Set up SSL certificates
5. Configure database connections

### Environment Variables for Production
```bash
# Frontend
VITE_API_URL=https://your-api-domain.com/api

# Backend
NODE_ENV=production
PORT=4000
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-secure-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
FACEBOOK_APP_ID=your-production-facebook-app-id
FACEBOOK_APP_SECRET=your-production-facebook-app-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce
4. Add relevant logs and screenshots

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Admin dashboard for product management
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Multi-language support
- [ ] Mobile app (React Native)

