
import React from 'react';
import { useAppState } from '../state/AppState.js';
import { CartIcon, PlusIcon, MinusIcon } from '../components/Icon.js';

const CartView = () => {
  const { cart, removeFromCart, updateCartItemQuantity, placeOrder } = useAppState();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    // Navigate to checkout so the user can select payment method
    window.location.hash = '#/checkout';
  };

  if (cart.length === 0) {
    return (
      React.createElement('div', { className: "container mx-auto px-6 py-24 text-center" },
        React.createElement(CartIcon, { className: "h-24 w-24 mx-auto text-gray-300" }),
        React.createElement('h1', { className: "text-4xl font-serif mt-6" }, "Your Cart is Empty"),
        React.createElement('p', { className: "text-gray-600 mt-2" }, "Looks like you haven't added anything to your cart yet."),
        React.createElement('a', { href: "#/", className: "mt-8 inline-block bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" },
          "Continue Shopping"
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16" },
        React.createElement('h1', { className: "text-4xl font-serif text-center font-semibold mb-12" }, "Shopping Cart"),
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-12" },
          React.createElement('div', { className: "lg:col-span-2 space-y-6" },
            cart.map(item => (
              React.createElement('div', { key: item.id, className: "flex items-center bg-gray-50 p-4 rounded-lg shadow-sm" },
                React.createElement('img', { src: item.imageUrl, alt: item.name, className: "w-24 h-24 object-cover rounded-md flex-shrink-0" }),
                React.createElement('div', { className: "flex-grow ml-4" },
                  React.createElement('a', { href: `#/product/${item.id}`, className: "font-serif text-xl hover:underline" }, item.name),
                  React.createElement('p', { className: "text-sm text-gray-500" }, item.category),
                  React.createElement('button', { onClick: () => removeFromCart(item.id), className: "text-xs text-red-500 hover:underline mt-1" }, "Remove")
                ),
                React.createElement('div', { className: "flex flex-col sm:flex-row items-end sm:items-center gap-4 ml-4" },
                  React.createElement('div', { className: "flex items-center border rounded-md bg-white" },
                    React.createElement('button', { onClick: () => updateCartItemQuantity(item.id, item.quantity - 1), className: "p-2 text-gray-600 hover:bg-gray-100" }, React.createElement(MinusIcon, { className: "h-4 w-4" })),
                    React.createElement('span', { className: "px-3 text-sm font-semibold" }, item.quantity),
                    React.createElement('button', { onClick: () => updateCartItemQuantity(item.id, item.quantity + 1), className: "p-2 text-gray-600 hover:bg-gray-100" }, React.createElement(PlusIcon, { className: "h-4 w-4" }))
                  ),
                  React.createElement('p', { className: "font-semibold w-24 text-right" }, `$${(item.price * item.quantity).toLocaleString()}`)
                )
              )
            ))
          ),
          React.createElement('div', { className: "bg-gray-50 p-6 rounded-lg shadow-sm h-fit" },
            React.createElement('h2', { className: "text-2xl font-serif font-semibold border-b pb-4" }, "Order Summary"),
            React.createElement('div', { className: "space-y-3 mt-4 text-gray-600" },
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "Subtotal"),
                React.createElement('span', null, `$${subtotal.toLocaleString()}`)
              ),
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "Shipping"),
                React.createElement('span', null, `$${shipping.toLocaleString()}`)
              )
            ),
            React.createElement('div', { className: "flex justify-between font-bold text-xl mt-6 border-t pt-4" },
              React.createElement('span', null, "Total"),
              React.createElement('span', null, `$${total.toLocaleString()}`)
            ),
            React.createElement('button', {
              onClick: handlePlaceOrder,
              className: "mt-6 w-full bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300"
            }, "Proceed to Checkout")
          )
        )
      )
    )
  );
};

export default CartView;
