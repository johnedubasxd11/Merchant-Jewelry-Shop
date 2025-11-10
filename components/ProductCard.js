import React from 'react';
import { useAppState } from '../state/AppState.js';
import { WishlistIcon } from './Icon.js';
import StarRating from './StarRating.js';

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useAppState();
  const onWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;
    
  return (
    React.createElement('div', { className: "group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 relative" },
      React.createElement('button', {
        onClick: handleWishlistToggle,
        className: `absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${onWishlist ? 'text-red-500 bg-red-100' : 'text-gray-400 bg-white/50 hover:text-red-500'}`,
        'aria-label': onWishlist ? 'Remove from wishlist' : 'Add to wishlist'
      },
        React.createElement(WishlistIcon, { className: "h-6 w-6", filled: onWishlist })
      ),
      React.createElement('a', {
        href: `#/product/${product.id}`,
        className: "block"
      },
        React.createElement('div', { className: "overflow-hidden" },
          React.createElement('img', {
            src: product.imageUrl,
            alt: product.name,
            className: "w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out",
            onError: (e) => {
              const svg = encodeURI("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24' font-family='serif'>Image unavailable</text></svg>");
              e.currentTarget.src = svg;
              e.currentTarget.onerror = null;
            }
          })
        ),
        React.createElement('div', { className: "p-5 text-center" },
          React.createElement('h3', { className: "font-serif text-xl font-semibold text-brand-dark" }, product.name),
          React.createElement('div', { className: "flex justify-center items-center gap-2 mt-2" },
            averageRating > 0 ? 
              React.createElement(React.Fragment, null,
                React.createElement(StarRating, { rating: averageRating }),
                React.createElement('span', { className: "text-xs text-gray-500" }, `(${product.reviews.length})`)
              ) : React.createElement('div', { className: "h-5" }) 
          ),
          React.createElement('p', { className: "text-md text-gray-600 mt-1" }, `$${product.price.toLocaleString()}`)
        )
      )
    )
  );
};

export default ProductCard;
