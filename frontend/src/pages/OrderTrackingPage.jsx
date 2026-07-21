import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  HashtagIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import getImageUrl from '../utils/getImageUrl';

const API_BASE = 'https://electronic-e-commerce-8f68.onrender.com/api';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: ClockIcon, description: 'Your order has been confirmed' },
  { key: 'processing', label: 'Processing', icon: CubeIcon, description: 'Your order is being prepared' },
  { key: 'shipped', label: 'Shipped', icon: TruckIcon, description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon, description: 'Your order has been delivered' }
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view order details');
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return STATUS_STEPS.findIndex(step => step.key === status);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-500 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStep = getStatusIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/orders" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-blue-100 text-sm">Order ID</p>
                <p className="text-xl font-bold">#{order._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Order Date</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {isCancelled ? (
            <div className="p-8 text-center">
              <ExclamationCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Cancelled</h3>
              <p className="text-gray-500">This order has been cancelled.</p>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking Status</h3>
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-500"
                    style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between relative">
                  {STATUS_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`text-xs font-semibold ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {(order.trackingNumber || order.currentLocation || order.estimatedDelivery || order.deliveryPartner?.name) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.trackingNumber && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <HashtagIcon className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Tracking Number</p>
                    <p className="font-semibold text-gray-900 text-sm">{order.trackingNumber}</p>
                  </div>
                </div>
              )}
              {order.currentLocation && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Current Location</p>
                    <p className="font-semibold text-gray-900 text-sm">{order.currentLocation}</p>
                  </div>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <CalendarIcon className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatDate(order.estimatedDelivery)}</p>
                  </div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Delivered On</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatDate(order.deliveredAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {order.deliveryPartner?.name && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Contact Person</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400">Name</p>
                      <p className="text-sm font-semibold text-gray-900">{order.deliveryPartner.name}</p>
                    </div>
                  </div>
                  {order.deliveryPartner.phone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{order.deliveryPartner.phone}</p>
                      </div>
                    </div>
                  )}
                  {order.deliveryPartner.vehicleNumber && (
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400">Vehicle</p>
                        <p className="text-sm font-semibold text-gray-900">{order.deliveryPartner.vehicleNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {order.trackingUpdates?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking History</h3>
            <div className="space-y-0">
              {[...order.trackingUpdates].reverse().map((update, index) => (
                <div key={index} className="flex gap-4 pb-6 relative">
                  {index < order.trackingUpdates.length - 1 && (
                    <div className="absolute top-6 left-[11px] w-0.5 h-full bg-gray-200" />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    index === 0 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    {index === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className={`font-semibold text-sm ${index === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                        {update.status?.charAt(0).toUpperCase() + update.status?.slice(1)}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(update.timestamp)}</p>
                    </div>
                    {update.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPinIcon className="h-3 w-3" /> {update.location}
                      </p>
                    )}
                    {update.note && (
                      <p className="text-xs text-gray-400 mt-1">{update.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress?.streetAddress}</p>
              <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p className="text-gray-600">{order.shippingAddress?.country}</p>
              <p className="text-gray-500 flex items-center gap-1 mt-2">
                <PhoneIcon className="h-3.5 w-3.5" /> {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1"><CreditCardIcon className="h-4 w-4" /> Method</span>
                <span className="font-semibold text-gray-900 uppercase">{order.paymentInfo?.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  order.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-700' :
                  order.paymentInfo?.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentInfo?.status?.toUpperCase()}
                </span>
              </div>
              {order.paymentInfo?.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Paid On</span>
                  <span className="font-semibold text-gray-900">{formatDate(order.paymentInfo.paidAt)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Subtotal</span>
                  <span>₹{order.itemsPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Tax</span>
                  <span>₹{order.taxPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
            Order Items ({order.orderItems?.length})
          </h3>
          <div className="space-y-4">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-white border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">₹{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
