
import React, { useState, useEffect } from 'react';
import { LogoIcon, CartIcon, OrderIcon, CloseIcon, SearchIcon, WishlistIcon, UserIcon } from './Icon.js';
import { useAppState } from '../state/AppState.js';

const Header = () => {
  const { cart, wishlist, isAuthenticated, logout, currentUser } = useAppState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  const navigateTo = (path) => {
    window.location.hash = path;
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.hash = `/?q=${encodeURIComponent(searchTerm.trim())}`;
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  }
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const UserMenu = () => (
    React.createElement('div', { className: 'relative' },
      React.createElement('button', {
        onClick: () => setIsUserMenuOpen(prev => !prev),
        className: "text-brand-dark hover:text-brand-gold transition-colors",
        'aria-label': "Open user menu"
      }, React.createElement(UserIcon, { className: "h-6 w-6" })),
      isUserMenuOpen && React.createElement('div', {
        className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
      },
        React.createElement('div', { className: 'px-4 py-2 text-sm text-gray-700 border-b' },
          React.createElement('p', { className: 'font-semibold' }, currentUser?.name),
          React.createElement('p', { className: 'text-xs text-gray-500 truncate' }, currentUser?.email)
        ),
        React.createElement('a', { href: "#/profile", onClick: () => navigateTo('/profile'), className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" }, "My Profile"),
        React.createElement('a', { href: "#/orders", onClick: () => navigateTo('/orders'), className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" }, "My Orders"),
        React.createElement('button', {
          onClick: handleLogout,
          className: "w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
        }, "Log Out")
      )
    )
  );

  return (
    React.createElement(React.Fragment, null,
      React.createElement('header', { className: "bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm" },
        React.createElement('div', { className: "container mx-auto px-6 py-4 flex justify-between items-center" },
          React.createElement('a', { href: "#/", className: "flex items-center space-x-3 cursor-pointer", 'aria-label': "Go to homepage" },
            React.createElement(LogoIcon, { className: "h-8 w-8 text-brand-dark" }),
            React.createElement('h1', { className: "text-3xl font-serif font-bold tracking-wider text-brand-dark" }, "MERCHANT")
          ),
          React.createElement('nav', { className: "hidden md:flex items-center space-x-8" },
            React.createElement('a', { href: "#/", className: "text-sm font-medium hover:text-brand-gold transition-colors" }, "Jewelry"),
            React.createElement('a', { href: "#/contact", className: "text-sm font-medium hover:text-brand-gold transition-colors" }, "Contact")
          ),
          React.createElement('div', { className: "flex items-center space-x-4 sm:space-x-6" },
            React.createElement('button', { onClick: () => setIsSearchOpen(true), className: "text-brand-dark hover:text-brand-gold transition-colors", 'aria-label': "Search" },
              React.createElement(SearchIcon, { className: "h-6 w-6" })
            ),
            isAuthenticated && React.createElement(React.Fragment, null,
              React.createElement('a', { href: "#/wishlist", className: "relative text-brand-dark hover:text-brand-gold transition-colors", 'aria-label': `View your wishlist, ${wishlistItemCount} items` },
                React.createElement(WishlistIcon, { className: "h-6 w-6" }),
                wishlistItemCount > 0 && React.createElement('span', { className: "absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" }, wishlistItemCount)
              ),
              React.createElement(UserMenu, null)
            ),
            React.createElement('a', { href: "#/cart", className: "relative text-brand-dark hover:text-brand-gold transition-colors", 'aria-label': `View your cart, ${cartItemCount} items` },
              React.createElement(CartIcon, { className: "h-6 w-6" }),
              cartItemCount > 0 && React.createElement('span', { className: "absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" }, cartItemCount)
            ),
            !isAuthenticated && React.createElement('a', { href: "#/login", className: "hidden md:block bg-brand-dark text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors" }, "Log In"),
            React.createElement('button', { className: "md:hidden", 'aria-label': "Open menu", onClick: () => setIsMenuOpen(true) },
              React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16m-7 6h7" })
              )
            )
          )
        )
      ),
      React.createElement('div', { className: `fixed inset-0 bg-black/50 z-50 transition-opacity md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`, onClick: () => setIsMenuOpen(false) }),
      React.createElement('div', { className: `fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}` },
        React.createElement('div', { className: "flex justify-between items-center p-4 border-b" },
          React.createElement('h2', { className: "font-serif text-xl" }, "Menu"),
          React.createElement('button', { onClick: () => setIsMenuOpen(false), 'aria-label': "Close menu" },
            React.createElement(CloseIcon, { className: "h-6 w-6" })
          )
        ),
        React.createElement('nav', { className: "flex flex-col p-4 space-y-4" },
          React.createElement('button', { onClick: () => navigateTo('/'), className: "text-left font-medium hover:text-brand-gold transition-colors" }, "Jewelry"),
          React.createElement('button', { onClick: () => navigateTo('/contact'), className: "text-left font-medium hover:text-brand-gold transition-colors" }, "Contact"),
          !isAuthenticated && React.createElement('button', { onClick: () => navigateTo('/login'), className: "text-left font-medium hover:text-brand-gold transition-colors" }, "Log In")
        )
      ),
      React.createElement('div', { className: `fixed inset-0 bg-black/60 z-50 transition-opacity ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`, onClick: () => setIsSearchOpen(false) }),
      React.createElement('div', { className: `fixed top-0 left-0 right-0 bg-white z-50 transform transition-transform shadow-lg ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}` },
        React.createElement('div', { className: "container mx-auto px-6 py-4" },
          React.createElement('form', { onSubmit: handleSearchSubmit, className: "flex items-center gap-4" },
            React.createElement(SearchIcon, { className: "h-5 w-5 text-gray-400" }),
            React.createElement('input', {
              type: "text",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Search for jewelry...",
              className: "w-full py-2 bg-transparent focus:outline-none text-lg",
              autoFocus: true
            }),
            React.createElement('button', { type: "button", onClick: () => setIsSearchOpen(false), 'aria-label': "Close search" },
              React.createElement(CloseIcon, { className: "h-6 w-6" })
            )
          )
        )
      )
    )
  );
};

export default Header;
