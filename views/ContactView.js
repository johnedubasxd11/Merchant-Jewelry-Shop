
import React, { useState } from 'react';
import { EmailIcon, PhoneIcon, LocationIcon } from '../components/Icon.js';

const ContactView = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    React.createElement('div', { className: "bg-white" },
      React.createElement('div', { className: "container mx-auto px-6 py-16 md:py-24" },
        React.createElement('div', { className: "text-center max-w-3xl mx-auto" },
          React.createElement('h1', { className: "text-4xl md:text-5xl font-serif font-bold" }, "Contact Us"),
          React.createElement('p', { className: "mt-4 text-lg text-gray-600" },
            "We would love to hear from you. Whether you have a question about our pieces, an order, or anything else, our team is ready to answer all your questions."
          )
        ),
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16" },
          React.createElement('div', { className: "bg-gray-50 p-8 rounded-lg" },
            React.createElement('h2', { className: "text-2xl font-serif font-semibold mb-6" }, "Send a Message"),
            isSubmitted ? (
              React.createElement('div', { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative", role: "alert" },
                React.createElement('strong', { className: "font-bold" }, "Thank you! "),
                React.createElement('span', { className: "block sm:inline" }, "Your message has been sent successfully.")
              )
            ) : (
              React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: "name", className: "block text-sm font-medium text-gray-700" }, "Full Name"),
                  React.createElement('input', { type: "text", name: "name", id: "name", required: true, value: formData.name, onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: "email", className: "block text-sm font-medium text-gray-700" }, "Email Address"),
                  React.createElement('input', { type: "email", name: "email", id: "email", required: true, value: formData.email, onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: "subject", className: "block text-sm font-medium text-gray-700" }, "Subject"),
                  React.createElement('input', { type: "text", name: "subject", id: "subject", required: true, value: formData.subject, onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: "message", className: "block text-sm font-medium text-gray-700" }, "Message"),
                  React.createElement('textarea', { name: "message", id: "message", rows: "4", required: true, value: formData.message, onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold" })
                ),
                React.createElement('div', null,
                  React.createElement('button', { type: "submit", className: "w-full bg-brand-dark text-white py-3 px-6 font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300" },
                    "Send Message"
                  )
                )
              )
            )
          ),
          React.createElement('div', { className: "space-y-8" },
            React.createElement('div', null,
              React.createElement('h2', { className: "text-2xl font-serif font-semibold mb-4" }, "Contact Information"),
              React.createElement('ul', { className: "space-y-4 text-gray-600" },
                React.createElement('li', { className: "flex items-center" },
                  React.createElement(EmailIcon, { className: "h-6 w-6 mr-4 text-brand-gold" }),
                  React.createElement('a', { href: "mailto:contact@merchant.com", className: "hover:underline" }, "contact@merchant.com")
                ),
                React.createElement('li', { className: "flex items-center" },
                  React.createElement(PhoneIcon, { className: "h-6 w-6 mr-4 text-brand-gold" }),
                  React.createElement('span', null, "(555) 123-4567")
                ),
                React.createElement('li', { className: "flex items-start" },
                  React.createElement(LocationIcon, { className: "h-6 w-6 mr-4 text-brand-gold flex-shrink-0 mt-1" }),
                  React.createElement('span', null, "123 Elegance Ave, Jewel City, 12345")
                )
              )
            ),
            React.createElement('div', null,
              React.createElement('h2', { className: "text-2xl font-serif font-semibold mb-4" }, "Our Location"),
              React.createElement('div', { className: "rounded-lg overflow-hidden shadow-md h-[300px] md:h-[450px]", style: { backgroundImage: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)" } },
                React.createElement('div', { className: "w-full h-full flex items-center justify-center" },
                  React.createElement('span', { className: "text-gray-600" }, "Map preview unavailable")
                )
              )
            )
          )
        )
      )
    )
  );
};

export default ContactView;
