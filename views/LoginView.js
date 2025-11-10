
import React, { useState, useEffect } from 'react';
import { GoogleIcon, FacebookIcon } from '../components/Icon.js';
import { useAppState } from '../state/AppState.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

const LoginView = ({ redirectTo }) => {
  const [formData, setFormData] = useState({ identifier: 'alex.doe@example.com', password: 'password123' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAppState();

  useEffect(() => {
    // If user is already authenticated, redirect them away from login page
    if (isAuthenticated) {
      window.location.hash = '#/profile';
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.identifier, formData.password);
      // On success, redirect to the intended page or home
      window.location.hash = redirectTo ? `#/${redirectTo}` : '#/';
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In production, this would redirect to Google OAuth
    window.location.hash = '#/login/google';
  };

  const handleFacebookLogin = () => {
    // In production, this would redirect to Facebook OAuth
    window.location.hash = '#/login/facebook';
  };

  return (
    React.createElement('div', { className: "bg-white py-16 md:py-24" },
      React.createElement('div', { className: "container mx-auto px-6" },
        React.createElement('div', { className: "max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md" },
          React.createElement('h1', { className: "text-3xl font-serif text-center font-semibold mb-2" }, "Welcome Back"),
          React.createElement('p', { className: 'text-center text-gray-600 mb-8' }, 'Log in to manage your account.'),
          React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
            error && React.createElement('div', { className: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded' }, error),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "identifier", className: "block text-sm font-medium text-gray-700" }, "Email Address"),
              React.createElement('input', {
                type: "text",
                name: "identifier",
                id: "identifier",
                required: true,
                value: formData.identifier,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              })
            ),
            React.createElement('div', null,
              React.createElement('div', { className: "flex justify-between items-baseline" },
                React.createElement('label', { htmlFor: "password", className: "block text-sm font-medium text-gray-700" }, "Password"),
                React.createElement('a', { href: "#", className: "text-sm text-brand-gold hover:underline" }, "Forgot password?")
              ),
              React.createElement('input', {
                type: "password",
                name: "password",
                id: "password",
                required: true,
                value: formData.password,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              })
            ),
            React.createElement('button', {
              type: "submit",
              disabled: isLoading,
              className: "w-full bg-brand-dark text-white py-3 px-6 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300 flex justify-center items-center disabled:bg-gray-400"
            }, isLoading ? React.createElement(LoadingSpinner, null) : "Log In"),
            React.createElement('div', { className: "relative flex py-2 items-center" },
              React.createElement('div', { className: "flex-grow border-t border-gray-300" }),
              React.createElement('span', { className: "flex-shrink mx-4 text-gray-500 text-sm" }, "OR"),
              React.createElement('div', { className: "flex-grow border-t border-gray-300" })
            ),
            React.createElement('button', {
              type: "button",
              onClick: handleGoogleLogin,
              className: "w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-6 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300"
            },
              React.createElement(GoogleIcon, { className: "h-5 w-5" }),
              "Log in with Google"
            ),
            React.createElement('button', {
              type: "button",
              onClick: handleFacebookLogin,
              className: "w-full flex justify-center items-center gap-3 bg-blue-600 text-white py-3 px-6 font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
            },
              React.createElement(FacebookIcon, { className: "h-5 w-5" }),
              "Log in with Facebook"
            )
          ),
          React.createElement('p', { className: "text-center text-sm text-gray-600 mt-8" },
            "Don't have an account? ",
            React.createElement('a', { href: "#/signup", className: "font-medium text-brand-gold hover:underline" }, "Sign up")
          )
        )
      )
    )
  );
};

export default LoginView;
