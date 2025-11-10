import React, { useState, useEffect } from 'react';
import { GoogleIcon, FacebookIcon } from '../components/Icon.js';
import { useAppState } from '../state/AppState.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

const SignupView = ({ redirectTo }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAppState();

  useEffect(() => {
    // If user is already authenticated, redirect them away from signup page
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Enforce strong password: at least 8 chars, 1 upper, 1 lower, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      // On success, redirect to the intended page or home
      window.location.hash = redirectTo ? `#/${redirectTo}` : '#/profile';
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    React.createElement('div', { className: "bg-white py-16 md:py-24" },
      React.createElement('div', { className: "container mx-auto px-6" },
        React.createElement('div', { className: "max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md" },
          React.createElement('h1', { className: "text-3xl font-serif text-center font-semibold mb-2" }, "Create Account"),
          React.createElement('p', { className: 'text-center text-gray-600 mb-8' }, 'Join us and start shopping today.'),
          React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
            error && React.createElement('div', { className: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded' }, error),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "name", className: "block text-sm font-medium text-gray-700" }, "Full Name"),
              React.createElement('input', {
                type: "text",
                name: "name",
                id: "name",
                required: true,
                value: formData.name,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "email", className: "block text-sm font-medium text-gray-700" }, "Email Address"),
              React.createElement('input', {
                type: "email",
                name: "email",
                id: "email",
                required: true,
                value: formData.email,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "password", className: "block text-sm font-medium text-gray-700" }, "Password"),
              React.createElement('input', {
                type: "password",
                name: "password",
                id: "password",
                required: true,
                minLength: 8,
                value: formData.password,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              }),
              React.createElement('p', { className: "mt-1 text-xs text-gray-500" }, "Password must be at least 8 characters and include at least 1 uppercase, 1 lowercase, and 1 number.")
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700" }, "Confirm Password"),
              React.createElement('input', {
                type: "password",
                name: "confirmPassword",
                id: "confirmPassword",
                required: true,
                value: formData.confirmPassword,
                onChange: handleInputChange,
                className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              })
            ),
            React.createElement('button', {
              type: "submit",
              disabled: isLoading,
              className: "w-full bg-brand-dark text-white py-3 px-6 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300 flex justify-center items-center disabled:bg-gray-400"
            }, isLoading ? React.createElement(LoadingSpinner, null) : "Create Account"),
            React.createElement('div', { className: "relative flex py-2 items-center" },
              React.createElement('div', { className: "flex-grow border-t border-gray-300" }),
              React.createElement('span', { className: "flex-shrink mx-4 text-gray-500 text-sm" }, "OR"),
              React.createElement('div', { className: "flex-grow border-t border-gray-300" })
            ),
            React.createElement('button', {
              type: "button",
              className: "w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-6 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300"
            },
              React.createElement(GoogleIcon, { className: "h-5 w-5" }),
              "Sign up with Google"
            ),
            React.createElement('button', {
              type: "button",
              className: "w-full flex justify-center items-center gap-3 bg-blue-600 text-white py-3 px-6 font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
            },
              React.createElement(FacebookIcon, { className: "h-5 w-5" }),
              "Sign up with Facebook"
            )
          ),
          React.createElement('p', { className: "text-center text-sm text-gray-600 mt-8" },
            "Already have an account? ",
            React.createElement('a', { href: "#/login", className: "font-medium text-brand-gold hover:underline" }, "Log in")
          )
        )
      )
    )
  );
};

export default SignupView;