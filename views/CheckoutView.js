import React, { useState, useMemo } from 'react';
import { useAppState } from '../state/AppState.js';
import PaymentConfirmModal from '../components/PaymentConfirmModal.js';
import { useToast } from '../components/ToastProvider.js';

const PaymentLogo = ({ type }) => {
  // simple inline SVGs / badges for each provider
  switch ((type || '').toLowerCase()) {
    case 'mastercard':
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('svg', { width: 40, height: 24, viewBox: '0 0 40 24', xmlns: 'http://www.w3.org/2000/svg' },
          React.createElement('circle', { cx: 15, cy: 12, r: 9, fill: '#ff5f00' }),
          React.createElement('circle', { cx: 25, cy: 12, r: 9, fill: '#eb001b', opacity: '0.9' })
        ),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'MasterCard')
      );
    case 'visa':
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('svg', { width: 40, height: 24, viewBox: '0 0 40 24', xmlns: 'http://www.w3.org/2000/svg' },
          React.createElement('rect', { width: 40, height: 24, rx: 4, fill: '#1a1f71' }),
          React.createElement('text', { x: 8, y: 16, fill: 'white', style: { fontSize: 10, fontWeight: 700 } }, 'VISA')
        ),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'Visa')
      );
    case 'gcash':
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', { className: 'w-10 h-6 bg-green-500 rounded-sm flex items-center justify-center text-white font-bold text-xs' }, 'G'),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'Gcash')
      );
    case 'paymaya':
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', { className: 'w-10 h-6 bg-indigo-500 rounded-sm flex items-center justify-center text-white font-bold text-xs' }, 'PM'),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'PayMaya')
      );
    case 'paypal':
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', { className: 'w-10 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs' }, 'P'),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'PayPal')
      );
    case 'cod':
    default:
      return React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('div', { className: 'w-10 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-gray-800 font-bold text-xs' }, 'COD'),
        React.createElement('span', { className: 'text-sm font-semibold' }, 'Cash on Delivery')
      );
  }
};

const CheckoutView = () => {
  const { cart, placeOrder } = useAppState();
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [codFee, setCodFee] = useState(0);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const shipping = subtotal > 0 ? 15 : 0;

  const handleSelect = (method) => {
    setError(null);
    setSelected(method);
    if ((method || '').toLowerCase() === 'cod') {
      const fee = 25 + Math.floor(Math.random() * 6); // 25..30
      setCodFee(fee);
    } else {
      setCodFee(0);
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const toast = useToast();

  const handlePlace = () => {
    if (!selected) { setError('Please select a payment method'); toast.showToast('Please select a payment method', { type: 'error' }); return; }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setProcessing(true);
    setError(null);
    try {
      const paymentInfo = { method: selected };
      if (selected === 'cod') paymentInfo.deliveryFee = codFee;
      const order = await placeOrder(paymentInfo);
      if (order) {
        toast.showToast('Order placed successfully', { type: 'success' });
        window.location.hash = '#/confirmation';
      } else {
        const msg = 'Failed to place order';
        setError(msg);
        toast.showToast(msg, { type: 'error' });
      }
    } catch (err) {
      const msg = err?.message || 'Failed to place order';
      setError(msg);
      toast.showToast(msg, { type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    React.createElement('div', { className: 'bg-white' },
      React.createElement('div', { className: 'container mx-auto px-6 py-16' },
        React.createElement('h1', { className: 'text-4xl font-serif text-center font-semibold mb-8' }, 'Checkout'),
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-12' },
          React.createElement('div', { className: 'lg:col-span-2 space-y-6' },
            cart.map(item => (
              React.createElement('div', { key: item.id, className: 'flex items-center bg-gray-50 p-4 rounded-lg shadow-sm' },
                React.createElement('img', { src: item.imageUrl, alt: item.name, className: 'w-24 h-24 object-cover rounded-md flex-shrink-0' }),
                React.createElement('div', { className: 'flex-grow ml-4' },
                  React.createElement('p', { className: 'font-serif text-lg' }, item.name),
                  React.createElement('p', { className: 'text-sm text-gray-500' }, `Qty: ${item.quantity}`)
                ),
                React.createElement('div', { className: 'font-semibold' }, `$${(item.price * item.quantity).toLocaleString()}`)
              )
            ))
          ),
          React.createElement('div', { className: 'bg-gray-50 p-6 rounded-lg shadow-sm h-fit' },
            React.createElement('h2', { className: 'text-2xl font-serif font-semibold border-b pb-4' }, 'Payment & Summary'),
            React.createElement('div', { className: 'mt-4 space-y-4' },
              React.createElement('div', { className: 'text-gray-600' },
                React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', null, 'Subtotal'), React.createElement('span', null, `$${subtotal.toLocaleString()}`)),
                React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', null, 'Shipping'), React.createElement('span', null, `$${shipping.toLocaleString()}`)),
                codFee > 0 && React.createElement('div', { className: 'flex justify-between text-red-600' }, React.createElement('span', null, 'COD Delivery Fee'), React.createElement('span', null, `$${codFee}`))
              ),
              React.createElement('div', { className: 'flex justify-between font-bold text-xl mt-4 border-t pt-4' }, React.createElement('span', null, 'Total'), React.createElement('span', null, `$${(subtotal + shipping + codFee).toLocaleString()}`))
            ),
            React.createElement('div', { className: 'mt-6' },
              React.createElement('h3', { className: 'font-semibold mb-2' }, 'In Bank Card Method'),
              React.createElement('div', { className: 'grid grid-cols-1 gap-3' },
                React.createElement('button', { onClick: () => handleSelect('mastercard'), className: `w-full text-left p-3 rounded-md border ${selected === 'mastercard' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'mastercard' })),
                React.createElement('button', { onClick: () => handleSelect('visa'), className: `w-full text-left p-3 rounded-md border ${selected === 'visa' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'visa' }))
              )
            ),
            React.createElement('div', { className: 'mt-6' },
              React.createElement('h3', { className: 'font-semibold mb-2' }, 'Digital bank'),
              React.createElement('div', { className: 'grid grid-cols-1 gap-3' },
                React.createElement('button', { onClick: () => handleSelect('gcash'), className: `w-full text-left p-3 rounded-md border ${selected === 'gcash' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'gcash' })),
                React.createElement('button', { onClick: () => handleSelect('paymaya'), className: `w-full text-left p-3 rounded-md border ${selected === 'paymaya' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'paymaya' })),
                React.createElement('button', { onClick: () => handleSelect('paypal'), className: `w-full text-left p-3 rounded-md border ${selected === 'paypal' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'paypal' }))
              )
            ),
            React.createElement('div', { className: 'mt-6' },
              React.createElement('h3', { className: 'font-semibold mb-2' }, 'Other'),
              React.createElement('div', { className: 'grid grid-cols-1 gap-3' },
                React.createElement('button', { onClick: () => handleSelect('cod'), className: `w-full text-left p-3 rounded-md border ${selected === 'cod' ? 'border-brand-dark bg-white' : 'border-gray-200 bg-white'}` }, React.createElement(PaymentLogo, { type: 'cod' }))
              )
            ),
            error && React.createElement('p', { className: 'text-sm text-red-600 mt-4' }, error),
            React.createElement('button', { onClick: handlePlace, disabled: processing, className: 'mt-6 w-full bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300' }, processing ? 'Processing...' : 'Place Order'),
            React.createElement(PaymentConfirmModal, { show: showConfirm, onClose: () => setShowConfirm(false), onConfirm: handleConfirm, paymentSummary: { method: selected, subtotal, shipping, deliveryFee: codFee, total: subtotal + shipping + codFee } })
          )
        )
      )
    )
  );
};

export default CheckoutView;
