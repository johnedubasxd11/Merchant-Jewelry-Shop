import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const t = { id, message, type: opts.type || 'info', duration: opts.duration || 4000 };
    setToasts(prev => [...prev, t]);
    if (t.duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== id));
      }, t.duration);
    }
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    React.createElement(ToastContext.Provider, { value: { showToast, hideToast } },
      children,
      React.createElement('div', { className: 'fixed right-4 bottom-6 z-50 flex flex-col gap-2 items-end' },
        toasts.map(t => React.createElement('div', { key: t.id, className: `max-w-xs px-4 py-2 rounded shadow-lg text-sm text-white ${t.type === 'error' ? 'bg-red-500' : t.type === 'success' ? 'bg-green-600' : 'bg-black/80'}` }, t.message))
      )
    )
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
