
import React, { useState, useMemo, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import { getProducts } from '../services/api.js';

const HomeView = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => {
    let prods = [...products];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.category.toLowerCase().includes(lowercasedQuery) ||
        p.details.style.toLowerCase().includes(lowercasedQuery) ||
        p.details.material.toLowerCase().includes(lowercasedQuery) ||
        (p.details.gemstone && p.details.gemstone.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (activeCategory === 'All') {
      return prods;
    }
    
    return prods.filter(p => p.category === activeCategory);
  }, [products, activeCategory, searchQuery]);
  
  const renderContent = () => {
    if (isLoading) {
      return React.createElement('div', { className: 'container mx-auto px-6 py-24 text-center' },
        React.createElement(LoadingSpinner, null),
        React.createElement('p', { className: 'mt-4 text-lg text-gray-600' }, 'Loading Collection...')
      );
    }

    if (error) {
      return React.createElement('div', { className: 'container mx-auto px-6 py-24 text-center' },
        React.createElement('h2', { className: 'text-3xl font-serif text-red-600' }, 'Something Went Wrong'),
        React.createElement('p', { className: 'mt-2 text-gray-600' }, error)
      );
    }

    return (
      React.createElement('div', { className: "bg-white" },
        React.createElement('div', { className: "container mx-auto px-6 py-16 md:py-24" },
          React.createElement('div', { className: "text-center mb-12" },
            React.createElement('h3', { className: "text-3xl md:text-4xl font-serif font-semibold mb-2" }, "Our Collection"),
            searchQuery && React.createElement('p', { className: "text-gray-600 mb-6" },
              "Showing results for: ",
              React.createElement('span', { className: "font-semibold text-brand-dark" }, `"${searchQuery}"`)
            ),
            React.createElement('div', { className: "flex justify-center flex-wrap gap-2 md:gap-4" },
              categories.map(category =>
                React.createElement('button', {
                  key: category,
                  onClick: () => setActiveCategory(category),
                  className: `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${activeCategory === category ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }, category)
              )
            )
          ),
          filteredProducts.length > 0 ?
            React.createElement(ProductGrid, { products: filteredProducts }) :
            React.createElement('div', { className: "text-center py-16" },
              React.createElement('h3', { className: "text-2xl font-serif" }, "No Products Found"),
              React.createElement('p', { className: "text-gray-500 mt-2" }, "Try adjusting your search or category filters.")
            )
        )
      )
    );
  };
  
  return (
    React.createElement('div', null,
      React.createElement('div', { className: "relative h-[60vh] bg-cover bg-center", style: { backgroundImage: `url('/images/hero/hero-bg.svg')` } },
        React.createElement('div', { className: "absolute inset-0 bg-black/40" }),
        React.createElement('div', { className: "relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white" },
          React.createElement('h2', { className: "text-5xl md:text-7xl font-serif font-bold tracking-wide" }, "Timeless by Design"),
          React.createElement('p', { className: "mt-4 text-lg md:text-xl max-w-2xl" }, "Discover our collection of handcrafted jewelry, where modern elegance meets classic sophistication.")
        )
      ),
      renderContent()
    )
  );
};

export default HomeView;
