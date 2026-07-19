import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  SparklesIcon,
  HeartIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const useCountUp = (target, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
};

const values = [
  {
    icon: ShieldCheckIcon,
    title: 'Quality Assurance',
    description: 'Every product is carefully tested and verified for authenticity and quality.',
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery to get your products to you when you need them.',
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
  },
  {
    icon: ArrowPathIcon,
    title: 'Easy Returns',
    description: 'Hassle-free return policy to ensure your complete satisfaction.',
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-50',
  },
  {
    icon: SparklesIcon,
    title: 'Innovation',
    description: 'Always bringing you the latest technology and cutting-edge products.',
    gradient: 'from-violet-500 to-violet-700',
    bg: 'bg-violet-50',
  },
  {
    icon: HeartIcon,
    title: 'Customer First',
    description: 'Your satisfaction is our top priority in everything we do.',
    gradient: 'from-rose-500 to-rose-700',
    bg: 'bg-rose-50',
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Reach',
    description: 'Serving customers nationwide with expanding delivery options.',
    gradient: 'from-cyan-500 to-cyan-700',
    bg: 'bg-cyan-50',
  },
];

const team = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', initials: 'SJ', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Michael Chen', role: 'CTO', initials: 'MC', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Emily Davis', role: 'Head of Marketing', initials: 'ED', gradient: 'from-pink-500 to-rose-600' },
  { name: 'David Kumar', role: 'Customer Experience Lead', initials: 'DK', gradient: 'from-amber-500 to-orange-600' },
];

const AboutPage = () => {
  const customers = useCountUp(500, 2200);
  const products = useCountUp(10, 2000);
  const brands = useCountUp(50, 2100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
          {/* grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            Since 2020
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ElectroShop
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Your trusted destination for the latest electronics and technology products.
            We're passionate about bringing innovation to your doorstep.
          </p>

          {/* hero stats row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Happy Customers', value: `${customers.count}K+`, ref: customers.ref },
              { label: 'Products', value: `${products.count}K+`, ref: products.ref },
              { label: 'Brands', value: `${brands.count}+`, ref: brands.ref },
              { label: 'Support', value: '24/7', ref: null },
            ].map((s, i) => (
              <div
                key={i}
                ref={s.ref}
                className="rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/10 px-4 py-5"
              >
                <div className="text-2xl sm:text-3xl font-bold">{s.value}</div>
                <div className="text-xs sm:text-sm text-blue-200/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <span className="text-8xl font-serif text-blue-200 absolute -top-6 -left-4 select-none leading-none">
              &ldquo;
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 relative z-10">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base sm:text-lg">
              Founded in 2020, ElectroShop started with a simple mission: to make cutting-edge
              technology accessible to everyone. What began as a small startup has grown into
              one of the most trusted online electronics retailers in the region.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 text-base sm:text-lg">
              We believe that technology should enhance lives, not complicate them. That's why
              we carefully curate our product selection, working directly with manufacturers
              to bring you authentic, high-quality electronics at competitive prices.
            </p>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Today, we serve thousands of customers across the country, offering everything
              from smartphones and laptops to smart home devices and gaming accessories.
            </p>
          </div>

          {/* story visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl rotate-3 scale-[0.97]" />
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-10 border border-blue-100">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: `${customers.count}K+`, label: 'Happy Customers' },
                  { num: `${products.count}K+`, label: 'Products' },
                  { num: `${brands.count}+`, label: 'Brands' },
                  { num: '24/7', label: 'Support' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/80 rounded-xl p-5 text-center shadow-sm border border-blue-50">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {s.num}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What drives us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                  {/* hover accent bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">The people behind the brand</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="relative w-36 h-36 mx-auto mb-5">
                {/* glow ring */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}
                />
                {/* avatar */}
                <div
                  className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <span className="text-3xl font-bold text-white">{member.initials}</span>
                </div>
                {/* social links placeholder */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                  {['Li', 'Tw', 'Gh'].map((s, j) => (
                    <span
                      key={j}
                      className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        {/* animated dots pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Join the ElectroShop Family
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Discover amazing deals on the latest electronics and join thousands of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-indigo-700 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/60 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-bold hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
