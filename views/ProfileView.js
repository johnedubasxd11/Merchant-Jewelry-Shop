
import { useAppState } from '../state/AppState.js';
import React, { useState, useEffect } from 'react';
import { UserIcon } from '../components/Icon.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import PasswordModal from '../components/PasswordModal.js';

const ProfileView = () => {
  const { userProfile, updateUserProfile, isAuthenticated } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  if (!isAuthenticated || !userProfile) {
    return React.createElement('div', { className: 'container mx-auto px-6 py-24 text-center' },
        React.createElement(LoadingSpinner, null),
        React.createElement('p', { className: 'mt-4 text-lg text-gray-600' }, 'Loading Profile...')
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
  };

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16" },
        React.createElement('div', { className: "max-w-2xl mx-auto text-center" },
          React.createElement(UserIcon, { className: "h-24 w-24 mx-auto text-brand-dark" }),
          React.createElement('h1', { className: "text-4xl font-serif text-center font-semibold mt-6 mb-8" }, "My Profile")
        ),
        React.createElement('div', { className: "max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-sm" },
          isEditing ? (
            React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "name", className: "block text-sm font-medium text-gray-600 mb-1" }, "Full Name"),
                React.createElement('input', { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full p-2 border rounded-md" })
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "email", className: "block text-sm font-medium text-gray-600 mb-1" }, "Email Address"),
                React.createElement('input', { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, className: "w-full p-2 border rounded-md" })
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "shippingAddress", className: "block text-sm font-medium text-gray-600 mb-1" }, "Shipping Address"),
                React.createElement('textarea', { id: "shippingAddress", name: "shippingAddress", value: formData.shippingAddress, onChange: handleInputChange, rows: 3, className: "w-full p-2 border rounded-md" })
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "billingAddress", className: "block text-sm font-medium text-gray-600 mb-1" }, "Billing Address"),
                React.createElement('textarea', { id: "billingAddress", name: "billingAddress", value: formData.billingAddress, onChange: handleInputChange, rows: 3, className: "w-full p-2 border rounded-md" })
              ),
              React.createElement('div', { className: "flex gap-4 mt-4" },
                React.createElement('button', { type: "button", onClick: () => setIsEditing(false), className: "w-full bg-gray-200 text-gray-800 py-3 px-8 font-semibold rounded-md hover:bg-gray-300 transition-colors" }, "Cancel"),
                React.createElement('button', { type: "submit", className: "w-full bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors" }, "Save Changes")
              )
            )
          ) : (
            React.createElement('div', { className: "space-y-6" },
              React.createElement('div', null,
                React.createElement('label', { className: "text-sm font-medium text-gray-500" }, "Full Name"),
                React.createElement('p', { className: "text-lg font-semibold" }, userProfile.name)
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "text-sm font-medium text-gray-500" }, "Email Address"),
                React.createElement('p', { className: "text-lg font-semibold" }, userProfile.email)
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "text-sm font-medium text-gray-500" }, "Shipping Address"),
                React.createElement('p', { className: "text-lg font-semibold" }, userProfile.shippingAddress)
              ),
              React.createElement('div', null,
                React.createElement('label', { className: "text-sm font-medium text-gray-500" }, "Billing Address"),
                React.createElement('p', { className: "text-lg font-semibold" }, userProfile.billingAddress)
              ),
              React.createElement('button', { onClick: () => setIsEditing(true), className: "w-full mt-4 bg-brand-dark text-white py-3 px-8 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" }, "Edit Profile"),
              React.createElement('button', { onClick: () => setShowPasswordModal(true), className: "w-full mt-4 bg-gray-200 text-gray-800 py-3 px-8 font-semibold rounded-md hover:bg-gray-300 transition-colors" }, "Change Password")
            )
          )
        ),
        React.createElement(PasswordModal, { show: showPasswordModal, onClose: () => setShowPasswordModal(false) })
      )
    )
  );
};

export default ProfileView;
