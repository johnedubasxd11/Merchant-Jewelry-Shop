
import React from 'react';
import { LogoIcon, InstagramIcon, PinterestIcon, FacebookIcon } from './Icon.js';

const Footer = () => {
  return (
    React.createElement('footer', { className: "bg-brand-dark text-gray-300 mt-auto" },
      React.createElement('div', { className: "container mx-auto px-6 py-12" },
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-4 gap-8" },
          React.createElement('div', null,
            React.createElement('div', { className: "flex items-center space-x-3 mb-4" },
              React.createElement(LogoIcon, { className: "h-8 w-8 text-white" }),
              React.createElement('h2', { className: "text-2xl font-serif font-bold tracking-wider text-white" }, "MERCHANT")
            ),
            React.createElement('p', { className: "text-sm text-gray-400" }, "Crafting timeless elegance since 2024.")
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: "font-semibold tracking-wider uppercase mb-4" }, "Shop"),
            React.createElement('ul', { className: "space-y-2 text-sm" },
              React.createElement('li', null, React.createElement('a', { href: "#/", className: "hover:text-white" }, "All Jewelry")),
              React.createElement('li', null, React.createElement('a', { href: "#/", className: "hover:text-white" }, "Necklaces")),
              React.createElement('li', null, React.createElement('a', { href: "#/", className: "hover:text-white" }, "Rings")),
              React.createElement('li', null, React.createElement('a', { href: "#/", className: "hover:text-white" }, "Bracelets"))
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: "font-semibold tracking-wider uppercase mb-4" }, "About"),
            React.createElement('ul', { className: "space-y-2 text-sm" },
              React.createElement('li', null, React.createElement('a', { href: "#/our-story", className: "hover:text-white" }, "Our Story")),
              React.createElement('li', null, React.createElement('a', { href: "#/craftsmanship", className: "hover:text-white" }, "Craftsmanship")),
              React.createElement('li', null, React.createElement('a', { href: "#/contact", className: "hover:text-white" }, "Contact Us"))
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: "font-semibold tracking-wider uppercase mb-4" }, "Follow Us"),
            React.createElement('div', { className: "flex space-x-4" },
              React.createElement('a', { href: "#", className: "hover:text-white", 'aria-label': "Instagram" },
                React.createElement(InstagramIcon, { className: "h-6 w-6" })
              ),
              React.createElement('a', { href: "#", className: "hover:text-white", 'aria-label': "Pinterest" },
                React.createElement(PinterestIcon, { className: "h-6 w-6" })
              ),
              React.createElement('a', { href: "#", className: "hover:text-white", 'aria-label': "Facebook" },
                React.createElement(FacebookIcon, { className: "h-6 w-6" })
              )
            )
          )
        ),
        React.createElement('div', { className: "border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500" },
          React.createElement('p', null, `© ${new Date().getFullYear()} Merchant Jewelry. All rights reserved.`)
        )
      )
    )
  );
};

export default Footer;
