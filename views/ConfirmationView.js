
import React from 'react';
import { useAppState } from '../state/AppState.js';
import { useToast } from '../components/ToastProvider.js';

const ConfirmationView = () => {
  const { lastPlacedOrder } = useAppState();
  const toast = useToast();

  if (!lastPlacedOrder) {
    return (
      React.createElement('div', { className: "container mx-auto px-6 py-24 text-center" },
        React.createElement('h1', { className: "text-4xl font-serif mt-6" }, "No Order Found"),
        React.createElement('p', { className: "text-gray-600 mt-2" }, "It looks like you haven't placed an order yet."),
        React.createElement('a', { href: "#/", className: "mt-8 inline-block bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" },
          "Start Shopping"
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16" },
        React.createElement('div', { className: "max-w-3xl mx-auto text-center" },
          React.createElement('svg', { className: "h-20 w-20 mx-auto text-green-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
          ),
          React.createElement('h1', { className: "text-4xl font-serif text-center font-semibold mt-6" }, "Thank You For Your Order!"),
          React.createElement('p', { className: "text-gray-600 mt-2" }, "Your order has been placed successfully. A confirmation has been sent to your email.")
        ),
        React.createElement('div', { className: "max-w-3xl mx-auto bg-gray-50 p-6 mt-12 rounded-lg shadow-sm text-left" },
          React.createElement('div', { className: "flex justify-between items-baseline border-b pb-4 mb-4" },
            React.createElement('div', null,
              React.createElement('h2', { className: "font-semibold text-lg" }, `Order #${lastPlacedOrder.id.split('-')[1]}`),
              React.createElement('p', { className: "text-sm text-gray-500" }, `Date: ${lastPlacedOrder.date}`)
            ),
            React.createElement('p', { className: "font-bold text-xl" }, `$${lastPlacedOrder.total.toLocaleString()}`)
          ),
          // Payment details (if available)
          (lastPlacedOrder.payment || lastPlacedOrder.deliveryFee) && React.createElement('div', { className: "mb-4 text-sm text-gray-700" },
            React.createElement('div', { className: 'flex justify-between items-center' },
              React.createElement('div', null,
                React.createElement('p', { className: "font-medium" }, 'Payment method:'),
                React.createElement('p', { className: "text-gray-600" }, `${(lastPlacedOrder.payment && lastPlacedOrder.payment.method) || lastPlacedOrder.method || 'N/A'}`)
              ),
              React.createElement('div', { className: "text-right" },
                lastPlacedOrder.deliveryFee ? React.createElement('p', { className: "font-medium" }, `Delivery / COD Fee: $${lastPlacedOrder.deliveryFee}`) : null
              )
            ),
            // show persisted paymentDetails if present
            lastPlacedOrder.paymentDetails && React.createElement('div', { className: 'mt-3 p-3 bg-white border rounded text-sm flex justify-between items-start' },
              React.createElement('div', null,
                React.createElement('p', { className: 'font-medium' }, 'Payment instructions'),
                lastPlacedOrder.paymentDetails.bank && React.createElement('p', { className: 'text-gray-700' }, `Bank: ${lastPlacedOrder.paymentDetails.bank}`),
                lastPlacedOrder.paymentDetails.provider && React.createElement('p', { className: 'text-gray-700' }, `Provider: ${lastPlacedOrder.paymentDetails.provider}`),
                lastPlacedOrder.paymentDetails.accountName && React.createElement('p', { className: 'text-gray-700' }, `Account name: ${lastPlacedOrder.paymentDetails.accountName}`),
                (lastPlacedOrder.paymentDetails.accountNumber || lastPlacedOrder.paymentDetails.mobile || lastPlacedOrder.paymentDetails.contact) && React.createElement('p', { className: 'text-gray-700' }, `Account / Contact: ${lastPlacedOrder.paymentDetails.accountNumber || lastPlacedOrder.paymentDetails.mobile || lastPlacedOrder.paymentDetails.contact}`),
                lastPlacedOrder.paymentDetails.note && React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, lastPlacedOrder.paymentDetails.note)
              ),
              React.createElement('div', null,
                (lastPlacedOrder.paymentDetails.accountNumber || lastPlacedOrder.paymentDetails.mobile || lastPlacedOrder.paymentDetails.contact) ? React.createElement('button', {
                  onClick: () => {
                    const text = lastPlacedOrder.paymentDetails.accountNumber || lastPlacedOrder.paymentDetails.mobile || lastPlacedOrder.paymentDetails.contact;
                    try { navigator.clipboard.writeText(String(text)).then(()=>toast.showToast('Copied to clipboard', { type: 'success' })).catch(()=>toast.showToast('Copy failed', { type: 'error' })); } catch (_) { toast.showToast('Copy failed', { type: 'error' }); }
                  },
                  className: 'inline-block bg-gray-200 text-gray-800 py-1 px-3 rounded'
                }, 'Copy') : null
              )
            )
          ),
          React.createElement('div', { className: "space-y-4" },
            lastPlacedOrder.items.map(item => (
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
        ),
        React.createElement('div', { className: "text-center mt-12" },
          React.createElement('a', { href: "#/", className: "bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" },
            "Continue Shopping"
          )
        )
      )
    )
  );
};

export default ConfirmationView;
