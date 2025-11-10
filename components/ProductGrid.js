
import React from 'react';
import ProductCard from './ProductCard.js';

const ProductGrid = ({ products }) => {
  return (
    React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12" },
      products.map(product => React.createElement(ProductCard, { key: product.id, product: product }))
    )
  );
};

export default ProductGrid;
