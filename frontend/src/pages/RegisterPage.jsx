import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Zap,
  CheckCircle, ArrowRight, Shield, Cpu, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const location = window.location.pathname;
  const [activeTab, setActiveTab] = useState(location === '/admin/register' ? 'admin' : 'customer');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const isAdmin = activeTab === 'admin';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: isAdmin ? 'admin' : 'customer',
      });
      toast.success(isAdmin ? 'Admin account created!' : 'Account created successfully!');
      navigate(isAdmin ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = passwordStrength(formData.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex">
      {/* Left Brand Panel */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-700 ${isAdmin ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950' : 'bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-14 h-14 backdrop-blur-sm rounded-2xl flex items-center justify-center ${isAdmin ? 'bg-purple-500/20' : 'bg-white/20'}`}>
                {isAdmin ? <ShieldCheck className="h-8 w-8 text-purple-300" /> : <Zap className="h-8 w-8 text-white" />}
              </div>
              <span className="text-2xl font-bold tracking-tight">{isAdmin ? 'Admin Portal' : 'ElectroShop'}</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight mb-4">
              {isAdmin ? 'Become an' : 'Join the'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                {isAdmin ? 'Admin Today' : 'Tech Revolution'}
              </span>
            </h2>
            <p className={`text-lg max-w-md leading-relaxed ${isAdmin ? 'text-purple-200/70' : 'text-purple-100/80'}`}>
              {isAdmin
                ? 'Get full access to manage products, orders, and store analytics.'
                : 'Create your account and unlock exclusive deals on the latest electronics.'}
            </p>
          </div>

          <div className="space-y-5 mt-8">
            {isAdmin
              ? ['Full store management access', 'Product & inventory control', 'Order processing & analytics'].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5 text-purple-300" />
                    </div>
                    <span className="text-purple-100/80 font-medium">{text}</span>
                  </div>
                ))
              : ['Exclusive member-only discounts', 'Order tracking & history', 'Wishlist & saved items', 'Fast & secure checkout'].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-purple-200" />
                    </div>
                    <span className="text-purple-100/90">{text}</span>
                  </div>
                ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <Cpu className="h-6 w-6 text-purple-200" />
              <span className="text-sm text-purple-100/80">
                Trusted by <span className="font-bold text-white">50,000+</span> customers across India
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isAdmin ? 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-500/25' : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-purple-500/25'}`}>
              {isAdmin ? <ShieldCheck className="h-9 w-9 text-white" /> : <Zap className="h-9 w-9 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ElectroShop</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setActiveTab('customer'); setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' }); setErrors({}); }}
                className={`flex-1 py-4 px-6 font-bold text-sm transition-all duration-300 relative flex items-center justify-center gap-2 ${
                  activeTab === 'customer' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-4 h-4" />
                Customer
                {activeTab === 'customer' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => { setActiveTab('admin'); setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' }); setErrors({}); }}
                className={`flex-1 py-4 px-6 font-bold text-sm transition-all duration-300 relative flex items-center justify-center gap-2 ${
                  activeTab === 'admin' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
                {activeTab === 'admin' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-full" />
                )}
              </button>
            </div>

            <div className="p-8 sm:p-10">
              <div className="mb-7">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isAdmin ? 'Admin Registration' : 'Create account'}
                </h1>
                <p className="text-gray-500">
                  {isAdmin ? 'Apply for admin access to manage the store' : 'Start your shopping journey with us'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 focus:bg-white ${
                        errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      } ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 focus:bg-white ${
                        errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      } ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 focus:bg-white ${
                        errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      } ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 focus:bg-white ${
                        errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      } ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-500">{strengthLabels[strength]}</span>
                    </div>
                  )}
                  {errors.password && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 focus:bg-white ${
                        errors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      } ${isAdmin ? 'focus:ring-purple-500/20 focus:border-purple-500' : 'focus:ring-blue-500/20 focus:border-blue-500'}`}
                      placeholder="Re-enter password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="mt-1.5 text-sm text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Passwords match
                    </p>
                  )}
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input type="checkbox" required className={`w-4 h-4 border-gray-300 rounded mt-0.5 ${isAdmin ? 'text-purple-600 focus:ring-purple-500' : 'text-purple-600 focus:ring-purple-500'}`} />
                  <label className="text-sm text-gray-600 leading-relaxed">
                    I agree to{' '}
                    <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.01] ${
                    isAdmin
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-purple-500/25'
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      {isAdmin ? 'Create Admin Account' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social logins for customer */}
              {!isAdmin && (
                <>
                  <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-400 font-medium">or register with</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </button>
                  </div>
                </>
              )}

              <p className="text-center text-gray-500 mt-8 text-sm">
                Already have an account?{' '}
                <Link to="/login" className={`font-bold transition-colors ${isAdmin ? 'text-purple-600 hover:text-purple-700' : 'text-purple-600 hover:text-purple-700'}`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
