import React from 'react';
import { useAppState } from '../state/AppState.js';
import { WishlistIcon } from '../components/Icon.js';
import ProductGrid from '../components/ProductGrid.js';

const WishlistView = () => {
  const { wishlist } = useAppState();

  if (wishlist.length === 0) {
    return (
      React.createElement('div', { className: "container mx-auto px-6 py-24 text-center" },
        React.createElement(WishlistIcon, { className: "h-24 w-24 mx-auto text-gray-300" }),
        React.createElement('h1', { className: "text-4xl font-serif mt-6" }, "Your Wishlist is Empty"),
        React.createElement('p', { className: "text-gray-600 mt-2" }, "Save your favorite items here to shop them later."),
        React.createElement('a', { href: "#/", className: "mt-8 inline-block bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" },
          "Explore the Collection"
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16" },
        React.createElement('h1', { className: "text-4xl font-serif text-center font-semibold mb-12" }, "My Wishlist"),
        React.createElement(ProductGrid, { products: wishlist })
      )
    )
  );
};

export default WishlistView;
