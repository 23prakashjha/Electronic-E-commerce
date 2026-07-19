import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const contactCards = [
  {
    icon: EnvelopeIcon,
    title: 'Email Us',
    details: ['support@electroshop.com', 'info@electroshop.com'],
    description: 'We respond within 24 hours',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    icon: PhoneIcon,
    title: 'Call Us',
    details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    description: 'Mon-Fri: 9AM-6PM EST',
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: MapPinIcon,
    title: 'Visit Us',
    details: ['123 Tech Street', 'Silicon Valley, CA 94025'],
    description: 'Showroom open Mon-Sat',
    gradient: 'from-amber-500 to-amber-700',
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    details: ['Mon-Fri: 9AM-6PM', 'Sat: 10AM-4PM', 'Sun: Closed'],
    description: '24/7 Online Support Available',
    gradient: 'from-violet-500 to-violet-700',
  },
];

const faqData = [
  {
    question: 'How can I track my order?',
    answer:
      'You can track your order by logging into your account and viewing your order history, or use the tracking number sent to your email.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for most items. Products must be in original condition with all accessories and packaging.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.',
  },
  {
    question: 'How do I cancel my order?',
    answer:
      'Orders can be cancelled within 2 hours of placement. After that, please contact our customer service team.',
  },
  {
    question: 'Are your products genuine?',
    answer:
      'Yes, we only sell 100% genuine products sourced directly from manufacturers or authorized distributors.',
  },
];

/* ─── Accordion Item ─── */
const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        orderNumber: '',
      });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Get in{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            Have questions or need help? We're here for you. Reach out through any of the channels below.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ─── Contact Info Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactCards.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <div className="space-y-0.5 mb-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-400 text-xs">{info.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ─── Contact Form ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a Message</h2>
            <p className="text-gray-400 text-sm mb-8">We'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none"
                      placeholder="John Doe"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none"
                      placeholder="john@example.com"
                    />
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="ORD-123456"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Related</option>
                  <option value="product">Product Information</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Payment</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ─── Right Column: FAQ + Live Chat ─── */}
          <div className="space-y-6">
            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-2 mb-6">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
              </div>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <FaqItem key={index} faq={faq} />
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
              {/* pulse ring */}
              <div className="absolute top-6 right-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
              </div>
              <ChatBubbleLeftRightIcon className="h-10 w-10 mb-4 text-white/90" />
              <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-white/80 text-sm mb-6">
                Chat with our customer support team for real-time assistance.
              </p>
              <button className="w-full bg-white text-indigo-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* ─── Map / Location ─── */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Find Us</h2>
              <p className="text-gray-400 text-sm mb-8">Come visit our showroom</p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow">
                    <MapPinIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">ElectroShop Headquarters</p>
                    <p className="text-gray-500 text-sm">123 Tech Street</p>
                    <p className="text-gray-500 text-sm">Silicon Valley, CA 94025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow">
                    <PhoneIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Phone</p>
                    <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0 shadow">
                    <EnvelopeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Email</p>
                    <p className="text-gray-500 text-sm">support@electroshop.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* map placeholder */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-72 lg:h-auto lg:min-h-[320px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative text-center">
                <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium text-sm">Interactive Map</p>
                <p className="text-gray-300 text-xs mt-1">123 Tech Street, Silicon Valley</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
