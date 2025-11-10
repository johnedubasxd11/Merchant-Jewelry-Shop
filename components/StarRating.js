import React from 'react';
import { StarIcon } from './Icon.js';

const StarRating = ({ rating, className = "" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0; // Not used for now, but could be for partial stars
  const emptyStars = 5 - fullStars;

  return (
    React.createElement('div', { className: `flex items-center ${className}` },
      [...Array(fullStars)].map((_, i) =>
        React.createElement(StarIcon, { key: `full-${i}`, className: "h-5 w-5 text-yellow-400", filled: true })
      ),
      [...Array(emptyStars)].map((_, i) =>
        React.createElement(StarIcon, { key: `empty-${i}`, className: "h-5 w-5 text-gray-300", filled: false })
      )
    )
  );
};

export default StarRating;
