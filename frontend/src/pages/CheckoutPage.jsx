import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import getImageUrl from '../utils/getImageUrl';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    cartItems,
    totalAmount,
    shipping,
    tax,
    grandTotal,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayKey, setRazorpayKey] = useState('');
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    fetchRazorpayKey();
  }, [isAuthenticated, cartItems]);

  useEffect(() => {
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const fetchRazorpayKey = async () => {
    try {
      const res = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/payment/key');
      const data = await res.json();
      if (data.success) setRazorpayKey(data.key);
    } catch (error) {
      console.error('Error fetching Razorpay key:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const { fullName, phone, streetAddress, city, state, pincode } = shippingForm;
    if (!fullName.trim()) { toast.error('Please enter your full name'); return false; }
    if (!phone.trim() || phone.trim().length < 10) { toast.error('Please enter a valid phone number'); return false; }
    if (!streetAddress.trim()) { toast.error('Please enter your street address'); return false; }
    if (!city.trim()) { toast.error('Please enter your city'); return false; }
    if (!state.trim()) { toast.error('Please enter your state'); return false; }
    if (!pincode.trim() || pincode.trim().length < 6) { toast.error('Please enter a valid pincode'); return false; }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderOnServer = async (paymentInfo) => {
    const orderItems = cartItems.map(item => ({
      product: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    const res = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        orderItems,
        shippingAddress: shippingForm,
        paymentInfo,
        taxPrice: Math.round(tax),
        shippingPrice: shipping
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create order');
    return data.order;
  };

  const verifyPayment = async (paymentData) => {
    const res = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Payment verification failed');
    return data.order;
  };

  const handleRazorpayPayment = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const order = await createOrderOnServer({
        method: 'razorpay',
        status: 'pending'
      });

      const razorpayOrderRes = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          receipt: order._id
        })
      });

      const razorpayOrderData = await razorpayOrderRes.json();
      if (!razorpayOrderData.success) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        key: razorpayKey,
        amount: razorpayOrderData.order.amount,
        currency: razorpayOrderData.order.currency,
        name: 'ElectroShop',
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        order_id: razorpayOrderData.order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            });

            clearCart();
            toast.success('Payment successful! Order placed.');
            navigate('/orders');
          } catch (error) {
            toast.error('Payment verification failed. Contact support.');
            navigate('/orders');
          }
        },
        prefill: {
          name: shippingForm.fullName,
          contact: shippingForm.phone,
          email: user?.email
        },
        notes: {
          address: `${shippingForm.streetAddress}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.pincode}`
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      await createOrderOnServer({
        method: 'cod',
        status: 'pending'
      });

      clearCart();
      toast.success('Order placed successfully! Pay on delivery.');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
            <p className="text-gray-500 mt-1">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your order</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s ? <CheckCircleIcon className="h-5 w-5" /> : s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                {s === 1 ? 'Shipping' : 'Payment'}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > 1 ? 'bg-purple-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPinIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                      <p className="text-gray-500 text-sm">Where should we deliver your order?</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" name="fullName" value={shippingForm.fullName} onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                          placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="tel" name="phone" value={shippingForm.phone} onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                          placeholder="+91 9876543210" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address *</label>
                    <input type="text" name="streetAddress" value={shippingForm.streetAddress} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                      placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                      <input type="text" name="city" value={shippingForm.city} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                        placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                      <input type="text" name="state" value={shippingForm.state} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                        placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode *</label>
                      <input type="text" name="pincode" value={shippingForm.pincode} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                        placeholder="400001" maxLength={6} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                      <input type="text" name="country" value={shippingForm.country} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50"
                        disabled />
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button onClick={() => { if (validateShipping()) setStep(2); }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-purple-600/20">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <MapPinIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                          <p className="text-gray-500 text-sm">{shippingForm.fullName}, {shippingForm.streetAddress}, {shippingForm.city}, {shippingForm.state} - {shippingForm.pincode}</p>
                        </div>
                      </div>
                      <button onClick={() => setStep(1)} className="text-purple-600 text-sm font-semibold hover:text-purple-700">Edit</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <CreditCardIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                        <p className="text-gray-500 text-sm">Choose how you'd like to pay</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'razorpay' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <CreditCardIcon className={`h-5 w-5 ${paymentMethod === 'razorpay' ? 'text-purple-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-gray-900">Razorpay (Online Payment)</p>
                        <p className="text-gray-500 text-sm">UPI, Credit/Debit Cards, Net Banking, Wallets</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-purple-500' : 'border-gray-300'}`}>
                        {paymentMethod === 'razorpay' && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <BanknotesIcon className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-gray-900">Cash on Delivery</p>
                        <p className="text-gray-500 text-sm">Pay when your order arrives</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-purple-500' : 'border-gray-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-5 w-5" />
                        {paymentMethod === 'razorpay' ? `Pay ₹${grandTotal.toLocaleString()}` : 'Place Order'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <img src={getImageUrl(item.image)} alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (18% GST)</span>
                  <span className="font-medium text-gray-900">₹{Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-lg text-gray-900">₹{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                  <ShieldCheckIcon className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Your payment is secured with 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
