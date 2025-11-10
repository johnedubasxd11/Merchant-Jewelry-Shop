
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AppStateProvider } from './state/AppState.js';
import ToastProvider from './components/ToastProvider.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(AppStateProvider, null,
        React.createElement(ToastProvider, null,
          React.createElement(App, null)
        )
      )
  )
);
