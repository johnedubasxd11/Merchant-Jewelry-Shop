import React, { useEffect, useRef } from 'react';

const PaymentConfirmModal = ({ show, onClose, onConfirm, paymentSummary }) => {
  const modalRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const previousActive = document.activeElement;

    // Focus the confirm button when modal opens
    const timer = setTimeout(() => {
      if (confirmRef.current) confirmRef.current.focus();
    }, 0);

    // Keydown handler for Escape and focus trap (Tab)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      if (previousActive && previousActive.focus) previousActive.focus();
    };
  }, [show, onClose]);

  if (!show) return null;

  const { method, subtotal = 0, shipping = 0, deliveryFee = 0, total = 0 } = paymentSummary || {};

  return (
    React.createElement('div', { className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center", role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'confirm-payment-title', 'aria-describedby': 'confirm-payment-desc' },
      React.createElement('div', { ref: modalRef, className: "relative mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white" },
        React.createElement('div', { className: "text-left" },
          React.createElement('h3', { id: 'confirm-payment-title', className: "text-2xl font-bold text-gray-900 mb-2" }, 'Confirm Payment'),
          React.createElement('p', { id: 'confirm-payment-desc', className: "text-sm text-gray-600 mb-4" }, `Payment method: ${method?.toUpperCase() || 'N/A'}`),
          React.createElement('div', { className: "space-y-2 mb-4" },
            React.createElement('div', { className: "flex justify-between text-gray-700" }, React.createElement('span', null, 'Subtotal'), React.createElement('span', null, `$${subtotal.toLocaleString()}`)),
            React.createElement('div', { className: "flex justify-between text-gray-700" }, React.createElement('span', null, 'Shipping'), React.createElement('span', null, `$${shipping.toLocaleString()}`)),
            deliveryFee > 0 && React.createElement('div', { className: "flex justify-between text-gray-700" }, React.createElement('span', null, 'Delivery / COD Fee'), React.createElement('span', null, `$${deliveryFee}`)),
            React.createElement('div', { className: "flex justify-between font-bold text-lg pt-2 border-t" }, React.createElement('span', null, 'Total'), React.createElement('span', null, `$${total.toLocaleString()}`))
          ),
          React.createElement('div', { className: "flex justify-end gap-3" },
            React.createElement('button', { onClick: onClose, className: "px-4 py-2 rounded-md border text-gray-700", 'aria-label': 'Cancel payment' }, 'Cancel'),
            React.createElement('button', { ref: confirmRef, onClick: onConfirm, className: "px-4 py-2 rounded-md bg-brand-dark text-white", 'aria-label': 'Confirm payment' }, 'Confirm Payment')
          )
        )
      )
    )
  );
};

export default PaymentConfirmModal;
