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
  status: {
    type: String,
    default: "paid"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
