const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: { type: String, enum: ['tyre', 'part'], default: 'tyre' },
  vehicleCategory: { type: String, default: '' },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tyreSize: { type: String, required: true },
  stock: { type: Number, required: true, default: 10 },
  images: { type: [String], required: true, default: [] },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  badge: { type: String, default: null },
  featuredOnHome: { type: Boolean, default: false },
  specs: { type: Object, default: {} },
  compatibility: [{
    vehicleType: String,
    brand: String,
    model: String,
    year: String
  }],
  sizes: [{
    size: { type: String, required: true },
    rim: { type: Number, required: true },
    loadIndex: { type: String },
    sku: { type: String },
    stock: { type: Boolean, default: true }
  }],
  relatedParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
