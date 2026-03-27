import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon
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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_40%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Electro</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Shop</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted destination for the latest electronics and gadgets. 
              We offer quality products at competitive prices with excellent customer service.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.toLowerCase())}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">support@electroshop.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">
                  123 Tech Street, Silicon Valley,<br />
                  Bangalore, Karnataka 560001
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold mb-3 text-white">Newsletter</h5>
              <p className="text-gray-400 text-xs mb-4">
                Subscribe to get special offers and updates
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-l-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h5 className="text-sm font-semibold mb-4 text-white text-center md:text-left">Payment Methods</h5>
              <div className="flex space-x-3">
                {[
                  { name: 'VISA', color: 'from-blue-600 to-blue-700' },
                  { name: 'MC', color: 'from-red-600 to-red-700' },
                  { name: 'UPI', color: 'from-purple-600 to-purple-700' },
                  { name: 'RZP', color: 'from-blue-700 to-blue-800' }
                ].map((method, i) => (
                  <div key={i} className={`w-14 h-9 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <span className="text-xs font-bold text-white">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-gray-400 text-sm">
                Secure Checkout with 256-bit SSL Encryption
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} ElectroShop. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap justify-center space-x-6 text-xs">
            <Link to="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="text-gray-500 hover:text-blue-400 transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping" className="text-gray-500 hover:text-blue-400 transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
