import React from 'react';

const LoadingSpinner = () => {
  return (
    React.createElement('div', { className: "flex justify-center items-center" },
      React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark" })
    )
  );
};

export default LoadingSpinner;
