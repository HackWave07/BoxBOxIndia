const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = guest order
  items: Array,
  total: Number,
  customer: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String
  },
  paymentId: String,
  orderId: String,
  signature: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'paid'],
    default: "pending"
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'ready', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'],
    default: 'pending'
  },
  courierName: { type: String, default: '' },
  trackingId: { type: String, default: '' },
  dispatchDate: Date,
  deliveryDate: Date,
  inventoryAdjusted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
