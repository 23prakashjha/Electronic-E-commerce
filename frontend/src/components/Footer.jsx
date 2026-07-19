import React, { useState } from 'react';
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
  CheckCircleIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const categories = [
    'Laptops',
    'Smartphones',
    'Tablets',
    'Smart Watches',
    'Headphones',
    'Cameras',
    'Gaming',
    'Accessories',
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Return Policy', path: '/return' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' },
  ];

  const socialLinks = [
    { name: 'Website', icon: GlobeAltIcon, href: '#' },
    { name: 'Chat', icon: ChatBubbleLeftRightIcon, href: '#' },
    { name: 'Gallery', icon: PhotoIcon, href: '#' },
    { name: 'Community', icon: UserGroupIcon, href: '#' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Electro</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Shop
                </span>
              </div>
            </Link>

            <p className="text-gray-400/90 text-sm leading-relaxed max-w-xs">
              Your trusted destination for the latest electronics and gadgets. We
              offer quality products at competitive prices with excellent customer
              service.
            </p>

            {/* Social icons with tooltip */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="relative group/social"
                >
                  <div className="w-10 h-10 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
                    <social.icon className="h-[18px] w-[18px] text-gray-400 group-hover/social:text-white transition-colors duration-300" />
                  </div>
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[11px] font-medium text-gray-200 opacity-0 group-hover/social:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-1 group-hover/social:translate-y-0 shadow-xl">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/60 mb-5 flex items-center gap-2.5">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full" />
              Categories
            </h4>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.toLowerCase())}`}
                    className="text-gray-400 hover:text-blue-400 text-[13px] leading-9 flex items-center gap-2 group/link transition-colors duration-200"
                  >
                    <span className="w-0 group-hover/link:w-2 transition-all duration-300 overflow-hidden">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                      {category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/60 mb-5 flex items-center gap-2.5">
              <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 text-[13px] leading-9 flex items-center gap-2 group/link transition-colors duration-200"
                  >
                    <span className="w-0 group-hover/link:w-2 transition-all duration-300 overflow-hidden">
                      <ArrowRightIcon className="w-3 h-3" />
                    </span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/60 mb-5 flex items-center gap-2.5">
              <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-400 rounded-full" />
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 group/contact">
                <div className="w-9 h-9 bg-white/[0.06] rounded-xl flex items-center justify-center shrink-0 group-hover/contact:bg-blue-600 transition-colors duration-300">
                  <PhoneIcon className="h-4 w-4" />
                </div>
                <span className="text-[13px]">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 group/contact">
                <div className="w-9 h-9 bg-white/[0.06] rounded-xl flex items-center justify-center shrink-0 group-hover/contact:bg-green-600 transition-colors duration-300">
                  <EnvelopeIcon className="h-4 w-4" />
                </div>
                <span className="text-[13px]">support@electroshop.com</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 group/contact">
                <div className="w-9 h-9 bg-white/[0.06] rounded-xl flex items-center justify-center shrink-0 group-hover/contact:bg-purple-600 transition-colors duration-300">
                  <MapPinIcon className="h-4 w-4" />
                </div>
                <span className="text-[13px] leading-relaxed">
                  123 Tech Street, Silicon Valley,
                  <br />
                  Bangalore, Karnataka 560001
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-1.5">Newsletter</h5>
              <p className="text-gray-500 text-xs mb-3">
                Get special offers &amp; updates straight to your inbox.
              </p>
              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail('');
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 min-w-0 px-4 py-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-l-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.09] transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-95"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment & Security */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Payment badges */}
            <div>
              <h5 className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-3 text-center md:text-left">
                Payment Methods
              </h5>
              <div className="flex items-center gap-2.5">
                {[
                  { name: 'VISA', bg: 'from-blue-600/90 to-blue-700/90' },
                  { name: 'MC', bg: 'from-red-500/90 to-red-700/90' },
                  { name: 'UPI', bg: 'from-purple-600/90 to-purple-700/90' },
                  { name: 'RZP', bg: 'from-blue-700/90 to-indigo-800/90' },
                  { name: 'COD', bg: 'from-emerald-600/90 to-emerald-700/90' },
                ].map((method, i) => (
                  <div
                    key={i}
                    className={`w-14 h-9 bg-gradient-to-br ${method.bg} rounded-lg flex items-center justify-center shadow-md border border-white/[0.06] hover:scale-105 transition-transform duration-200`}
                  >
                    <span className="text-[10px] font-bold tracking-wide text-white">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-2.5 bg-white/[0.04] px-4 py-2.5 rounded-xl border border-white/[0.06]">
              <CheckCircleIcon className="h-4 w-4 text-emerald-400 shrink-0" />
              <p className="text-gray-400 text-xs">
                Secure Checkout with{' '}
                <span className="text-gray-300 font-medium">256-bit SSL</span>{' '}
                Encryption
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-xs">
                &copy; {currentYear} ElectroShop. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom links + Back to Top */}
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Refund Policy', path: '/refund' },
                { name: 'Shipping Policy', path: '/shipping' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-500 hover:text-blue-400 text-xs transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="group/backtotop flex items-center gap-2 text-xs text-gray-500 hover:text-blue-400 transition-colors duration-300"
            >
              <span className="hidden sm:inline">Back to Top</span>
              <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover/backtotop:bg-blue-600 group-hover/backtotop:border-blue-500 group-hover/backtotop:-translate-y-0.5 transition-all duration-300">
                <ArrowUpIcon className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
