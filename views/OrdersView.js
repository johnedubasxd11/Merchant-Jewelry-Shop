
import React from 'react';
import { useAppState } from '../state/AppState.js';
import { useToast } from '../components/ToastProvider.js';
import { OrderIcon } from '../components/Icon.js';

const OrdersView = () => {
  const { orders, cancelOrder } = useAppState();
  const toast = useToast();

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
              (order.payment || order.deliveryFee) && React.createElement('div', { className: "mb-4 text-sm text-gray-700" },
                React.createElement('div', { className: "flex justify-between items-center" },
                  React.createElement('div', null,
                    React.createElement('p', { className: "font-medium" }, 'Payment method:'),
                    React.createElement('p', { className: "text-gray-600" }, `${(order.payment && order.payment.method) || order.method || 'N/A'}`)
                  ),
                  React.createElement('div', { className: "text-right" },
                    order.deliveryFee ? React.createElement('p', { className: "font-medium" }, `Delivery / COD Fee: $${order.deliveryFee}`) : null
                  )
                ),
                // Show saved paymentDetails (merchant account/instructions) when present
                order.paymentDetails && React.createElement('div', { className: 'mt-3 p-3 bg-white border rounded text-sm flex justify-between items-start' },
                  React.createElement('div', null,
                    React.createElement('p', { className: 'font-medium' }, 'Payment instructions'),
                    order.paymentDetails.bank && React.createElement('p', { className: 'text-gray-700' }, `Bank: ${order.paymentDetails.bank}`),
                    order.paymentDetails.provider && React.createElement('p', { className: 'text-gray-700' }, `Provider: ${order.paymentDetails.provider}`),
                    order.paymentDetails.accountName && React.createElement('p', { className: 'text-gray-700' }, `Account name: ${order.paymentDetails.accountName}`),
                    (order.paymentDetails.accountNumber || order.paymentDetails.mobile || order.paymentDetails.contact) && React.createElement('p', { className: 'text-gray-700' }, `Account / Contact: ${order.paymentDetails.accountNumber || order.paymentDetails.mobile || order.paymentDetails.contact}`),
                    order.paymentDetails.note && React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, order.paymentDetails.note)
                  ),
                  React.createElement('div', null,
                    (order.paymentDetails.accountNumber || order.paymentDetails.mobile || order.paymentDetails.contact) ? React.createElement('button', {
                      onClick: () => {
                        const text = order.paymentDetails.accountNumber || order.paymentDetails.mobile || order.paymentDetails.contact;
                        try { navigator.clipboard.writeText(String(text)).then(()=>toast.showToast('Copied to clipboard', { type: 'success' })).catch(()=>toast.showToast('Copy failed', { type: 'error' })); } catch (_) { toast.showToast('Copy failed', { type: 'error' }); }
                      },
                      className: 'inline-block bg-gray-200 text-gray-800 py-1 px-3 rounded'
                    }, 'Copy') : null
                  )
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
                )),
                // Actions: show Cancel button when allowed
                React.createElement('div', { className: "mt-4" },
                  (!order.isCanceled && !order.isPaid && !order.isDelivered) ? React.createElement('button', {
                    onClick: async () => {
                      if (!confirm('Are you sure you want to cancel this order?')) return;
                      try {
                        // use global app state cancelOrder (from component scope)
                        await cancelOrder(order.id);
                        // trigger a small reload of state by forcing a hash update so orders re-render
                        window.location.reload();
                      } catch (err) {
                        alert(err.message || 'Failed to cancel order');
                      }
                    },
                    className: "inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  }, "Cancel Order") : order.isCanceled ? React.createElement('span', { className: "text-sm text-gray-500" }, "Canceled") : null
                )
              )
            )
          ))
        )
      )
    )
  );
};

export default OrdersView;
