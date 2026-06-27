const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  orderType: { type: String, enum: ['Dine In', 'DineIn', 'Reservation', 'Delivery'], default: 'DineIn' },
  tableNumber: { type: String },
  address: { type: String },
  landmark: { type: String },
  notes: { type: String },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  reservationId: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered', 'Served', 'Cancelled'],
    default: 'Pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
