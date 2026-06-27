const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: String, required: true },
  tableType: { type: String, default: 'Local' },
  tableNumber: { type: String, default: null },
  specialRequests: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
