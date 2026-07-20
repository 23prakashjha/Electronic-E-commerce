const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    streetAddress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'card', 'upi'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    paidAt: {
      type: Date
    }
  },
  itemsPrice: {
    type: Number,
    required: true,
    min: [0, 'Items price cannot be negative']
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Tax price cannot be negative']
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Shipping price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveredAt: {
    type: Date
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  currentLocation: {
    type: String
  },
  deliveryPartner: {
    name: String,
    phone: String,
    vehicleNumber: String
  },
  trackingUpdates: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  notes: {
    type: String,
    maxlength: [500, 'Order notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
