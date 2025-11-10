
import React, { useState, useEffect, Suspense, lazy } from 'react';
import HomeView from './views/HomeView.js';
import DetailView from './views/DetailView.js';
import CartView from './views/CartView.js';
import OrdersView from './views/OrdersView.js';
import ProfileView from './views/ProfileView.js';
import ConfirmationView from './views/ConfirmationView.js';
import CheckoutView from './views/CheckoutView.js';
import ContactView from './views/ContactView.js';
import WishlistView from './views/WishlistView.js';
import LoginView from './views/LoginView.js';
import SignupView from './views/SignupView.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import { useAppState } from './state/AppState.js';
import LoadingSpinner from './components/LoadingSpinner.js';

// Lazy load SocialLoginView to prevent module loading issues
const SocialLoginView = lazy(() => import('./views/SocialLoginView.jsx'));

const App = () => {
  const [route, setRoute] = useState({ view: 'home' });
  const { isAuthenticated } = useAppState();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      const [path, queryString] = hash.substring(1).split('?');
      const searchParams = new URLSearchParams(queryString);
      const searchQuery = searchParams.get('q');
      
      let newRoute = { view: 'home', searchQuery };

      if (path.startsWith('/product/')) {
        const productId = path.substring('/product/'.length);
        newRoute = { view: 'detail', productId, searchQuery };
      } else if (path === '/cart') {
        newRoute = { view: 'cart', searchQuery };
      } else if (path === '/orders') {
        newRoute = { view: 'orders', searchQuery };
      } else if (path === '/profile') {
        newRoute = { view: 'profile', searchQuery };
      } else if (path === '/login') {
        newRoute = { view: 'login' };
      } else if (path === '/login/google') {
        newRoute = { view: 'social_login', provider: 'google' };
      } else if (path === '/login/facebook') {
        newRoute = { view: 'social_login', provider: 'facebook' };
      } else if (path === '/signup') {
        newRoute = { view: 'signup' };
      } else if (path === '/confirmation') {
        newRoute = { view: 'confirmation', searchQuery };
      } else if (path === '/checkout') {
        // Recognize the checkout hash so the CheckoutView is rendered
        newRoute = { view: 'checkout', searchQuery };
      } else if (path === '/contact') {
        newRoute = { view: 'contact' };
      } else if (path === '/wishlist') {
        newRoute = { view: 'wishlist' };
      } else if (path !== '/' && path !== '/home') {
        newRoute = { view: 'not_found', searchQuery };
      }
      
      setRoute(newRoute);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Parse initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const renderView = () => {
    const { view, productId, searchQuery, provider } = route;

  const protectedViews = ['cart', 'orders', 'profile', 'wishlist', 'confirmation', 'checkout'];

    if (protectedViews.includes(view) && !isAuthenticated) {
      return React.createElement(LoginView, { redirectTo: view });
    }

    switch (view) {
      case 'home':
        return React.createElement(HomeView, { searchQuery: searchQuery });
      case 'detail':
        return React.createElement(DetailView, { productId: productId });
      case 'cart':
        return React.createElement(CartView, null);
      case 'orders':
        return React.createElement(OrdersView, null);
      case 'profile':
        return React.createElement(ProfileView, null);
      case 'login':
        return React.createElement(LoginView, null);
      case 'social_login':
        return React.createElement(Suspense, { fallback: React.createElement(LoadingSpinner) },
          React.createElement(SocialLoginView, { provider: provider })
        );
      case 'signup':
        return React.createElement(SignupView, null);
      case 'confirmation':
        return React.createElement(ConfirmationView, null);
        case 'checkout':
          return React.createElement(CheckoutView, null);
      case 'contact':
        return React.createElement(ContactView, null);
      case 'wishlist':
        return React.createElement(WishlistView, null);
      case 'not_found':
          return React.createElement('div', { className: "text-center py-24" }, React.createElement('h1', { className: "text-4xl font-serif" }, "404 - Page Not Found"));
      default:
        return React.createElement(HomeView, { searchQuery: searchQuery });
    }
  };

  return (
    React.createElement('div', { className: "min-h-screen flex flex-col bg-gray-50" },
      React.createElement(Header, null),
      React.createElement('main', { className: "flex-grow" },
        renderView()
      ),
      React.createElement(Footer, null)
    )
  );
};

export default App;
