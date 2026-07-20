import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
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
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919876543210',
      color: 'hover:bg-green-600 hover:border-green-500 hover:shadow-green-500/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/electroshop',
      color: 'hover:bg-pink-600 hover:border-pink-500 hover:shadow-pink-500/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/electroshop',
      color: 'hover:bg-blue-600 hover:border-blue-500 hover:shadow-blue-500/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter / X',
      href: 'https://x.com/electroshop',
      color: 'hover:bg-sky-500 hover:border-sky-400 hover:shadow-sky-400/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@electroshop',
      color: 'hover:bg-red-600 hover:border-red-500 hover:shadow-red-500/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: 'https://t.me/electroshop',
      color: 'hover:bg-sky-600 hover:border-sky-500 hover:shadow-sky-500/20',
      svg: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
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

            {/* Social icons */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="relative group/social"
                >
                  <div className={`w-10 h-10 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
                    <span className="text-gray-400 group-hover/social:text-white transition-colors duration-300">
                      {social.svg}
                    </span>
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
