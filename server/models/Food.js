const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
