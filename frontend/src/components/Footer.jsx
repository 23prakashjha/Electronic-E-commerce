import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    'Laptops',
    'Smartphones',
    'Tablets',
    'Smart Watches',
    'Headphones',
    'Cameras',
    'Gaming',
    'Accessories'
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Return Policy', path: '/return' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' }
  ];

  const socialLinks = [
    { name: 'Website', icon: GlobeAltIcon, href: '#' },
    { name: 'Chat', icon: ChatBubbleLeftRightIcon, href: '#' },
    { name: 'Gallery', icon: PhotoIcon, href: '#' },
    { name: 'Community', icon: UserGroupIcon, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-400">ElectroShop</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted destination for the latest electronics and gadgets. 
              We offer quality products at competitive prices with excellent customer service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.toLowerCase())}`}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">support@electroshop.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Tech Street, Silicon Valley,<br />
                  Bangalore, Karnataka 560001
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-blue-400">Newsletter</h5>
              <p className="text-gray-300 text-xs mb-3">
                Subscribe to get special offers and updates
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h5 className="text-sm font-semibold mb-2 text-blue-400">Payment Methods</h5>
              <div className="flex space-x-4">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">VISA</span>
                </div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">MC</span>
                </div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">UPI</span>
                </div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">RZP</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} ElectroShop. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center space-x-6 text-xs">
            <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="text-gray-400 hover:text-blue-400 transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping" className="text-gray-400 hover:text-blue-400 transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
