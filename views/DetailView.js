
import React, { useState, useEffect } from 'react';
import { generateProductDescription } from '../services/geminiService.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import { useAppState } from '../state/AppState.js';
import { PlusIcon, MinusIcon, WishlistIcon } from '../components/Icon.js';
import StarRating from '../components/StarRating.js';
import { getProductById } from '../services/api.js';

const DetailView = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [description, setDescription] = useState('');
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isDescLoading, setIsDescLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useAppState();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsProductLoading(true);
        setError(null);
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Could not find the product you are looking for.');
        console.error(err);
      } finally {
        setIsProductLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    setIsDescLoading(true);
    setQuantity(1);

    const fetchDescription = async () => {
      try {
        const generatedDesc = await generateProductDescription(product);
        setDescription(generatedDesc);
      } catch (err) {
        console.error(err);
        // Use fallback description on error
        setDescription("Discover the timeless elegance of this exquisite piece, crafted with the finest materials and exceptional attention to detail. A true testament to sophisticated design, it's destined to become a cherished heirloom.");
      } finally {
        setIsDescLoading(false);
      }
    };

    fetchDescription();
  }, [product]);

  if (isProductLoading) {
      return React.createElement('div', { className: 'container mx-auto px-6 py-24 text-center' }, React.createElement(LoadingSpinner, null));
  }
  
  if (error) {
      return React.createElement('div', { className: "text-center py-24" }, 
        React.createElement('h1', { className: "text-4xl font-serif" }, "404 - Product Not Found"), 
        React.createElement('p', { className: "text-gray-600 mt-4" }, error)
      );
  }

  if (!product) {
      return null;
  }
  
  const onWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const handleWishlistToggle = () => {
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
    React.createElement('div', { className: "container mx-auto px-6 py-12 md:py-20" },
      React.createElement('a', { href: "#/", className: "mb-8 text-sm font-medium hover:text-brand-gold transition-colors flex items-center" },
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" })
        ),
        "Back to Collection"
      ),
      React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start" },
        React.createElement('div', { className: "bg-white rounded-lg shadow-lg overflow-hidden" },
          React.createElement('img', { src: product.imageUrl, alt: product.name, className: "w-full h-auto object-cover" })
        ),
        React.createElement('div', null,
          React.createElement('h1', { className: "text-4xl md:text-5xl font-serif font-bold text-brand-dark" }, product.name),
          React.createElement('div', { className: "flex items-center gap-2 mt-4" },
            averageRating > 0 && React.createElement(React.Fragment, null,
              React.createElement(StarRating, { rating: averageRating }),
              React.createElement('span', { className: "text-sm text-gray-500" }, `${averageRating.toFixed(1)} (${product.reviews.length} reviews)`)
            )
          ),
          React.createElement('p', { className: "text-3xl text-gray-700 mt-4" }, `$${product.price.toLocaleString()}`),
          React.createElement('div', { className: "mt-8 border-t pt-6" },
            React.createElement('h3', { className: "text-lg font-semibold uppercase tracking-wider mb-4" }, "Description"),
            isDescLoading ? (
              React.createElement('div', { className: "space-y-2" },
                React.createElement('div', { className: "bg-gray-200 h-4 w-full rounded animate-pulse" }),
                React.createElement('div', { className: "bg-gray-200 h-4 w-5/6 rounded animate-pulse" }),
                React.createElement('div', { className: "bg-gray-200 h-4 w-3/4 rounded animate-pulse" })
              )
            ) : (
              React.createElement('p', { className: "text-gray-600 leading-relaxed" }, description)
            )
          ),
          React.createElement('div', { className: "mt-8 border-t pt-6" },
            React.createElement('h3', { className: "text-lg font-semibold uppercase tracking-wider mb-4" }, "Details"),
            React.createElement('ul', { className: "space-y-2 text-gray-600" },
              React.createElement('li', null, React.createElement('strong', null, "Material:"), ` ${product.details.material}`),
              product.details.gemstone && React.createElement('li', null, React.createElement('strong', null, "Gemstone:"), ` ${product.details.gemstone}`),
              React.createElement('li', null, React.createElement('strong', null, "Style:"), ` ${product.details.style}`)
            )
          ),
          React.createElement('div', { className: "mt-10 flex items-center gap-4" },
            React.createElement('div', { className: "flex items-center border rounded-md" },
              React.createElement('button', { onClick: () => setQuantity(q => Math.max(1, q - 1)), className: "p-3 text-gray-600 hover:bg-gray-100" }, React.createElement(MinusIcon, { className: "h-5 w-5" })),
              React.createElement('span', { className: "px-4 font-semibold" }, quantity),
              React.createElement('button', { onClick: () => setQuantity(q => q + 1), className: "p-3 text-gray-600 hover:bg-gray-100" }, React.createElement(PlusIcon, { className: "h-5 w-5" }))
            ),
            React.createElement('button', {
              onClick: handleAddToCart,
              className: `flex-grow py-3 px-6 font-semibold rounded-md transition-all duration-300 ${isAdded ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-brand-dark text-white hover:bg-gray-800'}`,
              disabled: isAdded
            }, isAdded ? 'Added!' : 'Add to Cart'),
            React.createElement('button', {
              onClick: handleWishlistToggle,
              className: `p-3 rounded-md border transition-colors ${onWishlist ? 'bg-red-50 text-red-500 border-red-200' : 'border-gray-300 hover:bg-gray-100'}`,
              'aria-label': onWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            },
              React.createElement(WishlistIcon, { className: "h-6 w-6", filled: onWishlist })
            )
          )
        )
      ),
      React.createElement('div', { className: "mt-16 border-t pt-12" },
        React.createElement('h2', { className: "text-3xl font-serif font-bold text-center mb-8" }, "Customer Reviews"),
        React.createElement('div', { className: "max-w-4xl mx-auto" },
          product.reviews && product.reviews.length > 0 ? (
            React.createElement('div', { className: "space-y-8" },
              product.reviews.map(review => (
                React.createElement('div', { key: review.id, className: "border-b pb-6" },
                  React.createElement('div', { className: "flex items-center mb-2" },
                    React.createElement(StarRating, { rating: review.rating }),
                    React.createElement('p', { className: "ml-4 font-bold text-gray-800" }, review.author)
                  ),
                  React.createElement('p', { className: "text-gray-600" }, review.comment)
                )
              ))
            )
          ) : (
            React.createElement('p', { className: "text-center text-gray-500" }, "Be the first to review this product.")
          )
        )
      )
    )
  );
};

export default DetailView;
