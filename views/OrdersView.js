
import React from 'react';
import { useAppState } from '../state/AppState.js';
import { OrderIcon } from '../components/Icon.js';

const OrdersView = () => {
  const { orders } = useAppState();

  if (orders.length === 0) {
    return (
      React.createElement('div', { className: "container mx-auto px-6 py-24 text-center" },
        React.createElement(OrderIcon, { className: "h-24 w-24 mx-auto text-gray-300" }),
        React.createElement('h1', { className: "text-4xl font-serif mt-6" }, "Order History"),
        React.createElement('p', { className: "text-gray-600 mt-2" }, "You haven't placed any orders yet.")
      )
    );
  }

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16" },
        React.createElement('h1', { className: "text-4xl font-serif text-center font-semibold mb-12" }, "Your Orders"),
        React.createElement('div', { className: "space-y-8 max-w-4xl mx-auto" },
          orders.map(order => (
            React.createElement('div', { key: order.id, className: "bg-gray-50 p-6 rounded-lg shadow-sm" },
              React.createElement('div', { className: "flex justify-between items-baseline border-b pb-4 mb-4" },
                React.createElement('div', null,
                  React.createElement('h2', { className: "font-semibold text-lg" }, `Order #${order.id.split('-')[1]}`),
                  React.createElement('p', { className: "text-sm text-gray-500" }, `Date: ${order.date}`)
                ),
                React.createElement('p', { className: "font-bold text-xl" }, `$${order.total.toLocaleString()}`)
              ),
              // Payment summary (if available)
              (order.payment || order.deliveryFee) && React.createElement('div', { className: "mb-4 text-sm text-gray-700 flex justify-between items-center" },
                React.createElement('div', null,
                  React.createElement('p', { className: "font-medium" }, 'Payment method:'),
                  React.createElement('p', { className: "text-gray-600" }, `${(order.payment && order.payment.method) || order.method || 'N/A'}`)
                ),
                React.createElement('div', { className: "text-right" },
                  order.deliveryFee ? React.createElement('p', { className: "font-medium" }, `Delivery / COD Fee: $${order.deliveryFee}`) : null
                )
              ),
              React.createElement('div', { className: "space-y-4" },
                order.items.map(item => (
                  React.createElement('div', { key: item.id, className: "flex items-center" },
                    React.createElement('img', { src: item.imageUrl, alt: item.name, className: "w-16 h-16 object-cover rounded-md flex-shrink-0" }),
                    React.createElement('div', { className: "ml-4 flex-grow" },
                      React.createElement('p', { className: "font-semibold" }, item.name),
                      React.createElement('p', { className: "text-sm text-gray-600" }, `Quantity: ${item.quantity}`)
                    ),
                    React.createElement('p', { className: "text-gray-700" }, `$${(item.price * item.quantity).toLocaleString()}`)
                  )
                ))
              )
            )
          ))
        )
      )
    )
  );
};

export default OrdersView;
