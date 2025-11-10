import React, { useState } from 'react';

const PasswordModal = ({ show, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

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
        setTimeout(() => {
          onClose();
          setPasswordMessage({ type: '', text: '' });
        }, 2000); // Close modal after 2 seconds
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
  };

  if (!show) {
    return null;
  }

  return (
    React.createElement('div', { className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" },
      React.createElement('div', { className: "relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-md bg-white" },
        React.createElement('div', { className: "text-center" },
          React.createElement('h3', { className: "text-2xl font-bold text-gray-900" }, "Change Password"),
          React.createElement('div', { className: "mt-4 px-7 py-3" },
            passwordMessage.text && React.createElement('div', { className: `p-4 mb-4 text-sm rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}` }, passwordMessage.text),
            React.createElement('form', { onSubmit: handlePasswordSubmit },
              React.createElement('div', { className: "mb-4" },
                React.createElement('label', { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "currentPassword" }, "Current Password"),
                React.createElement('input', { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", id: "currentPassword", name: "currentPassword", type: "password", placeholder: "******************", value: passwordData.currentPassword, onChange: handlePasswordChange })
              ),
              React.createElement('div', { className: "mb-4" },
                React.createElement('label', { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "newPassword" }, "New Password"),
                React.createElement('input', { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", id: "newPassword", name: "newPassword", type: "password", placeholder: "******************", value: passwordData.newPassword, onChange: handlePasswordChange })
              ),
              React.createElement('div', { className: "mb-6" },
                React.createElement('label', { className: "block text-gray-700 text-sm font-bold mb-2", htmlFor: "confirmNewPassword" }, "Confirm New Password"),
                React.createElement('input', { className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", id: "confirmNewPassword", name: "confirmNewPassword", type: "password", placeholder: "******************", value: passwordData.confirmNewPassword, onChange: handlePasswordChange })
              ),
              React.createElement('div', { className: "flex items-center justify-between" },
                React.createElement('button', { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", type: "submit" }, "Change Password"),
                React.createElement('button', { className: "inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800", onClick: onClose, type: "button" }, "Cancel")
              )
            )
          )
        )
      )
    )
  );
};

export default PasswordModal;