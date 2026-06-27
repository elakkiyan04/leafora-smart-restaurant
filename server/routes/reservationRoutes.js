const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
console.log("✅ Reservation Routes Loaded");



// GET /api/reservations - Get all reservations, newest first
router.get('/', async (req, res) => {
  try {
    let reservations = await Reservation.find().sort({ createdAt: -1 });

    // Seed default reservations if collection is empty
    if (reservations.length === 0) {
      const seedReservations = [
        {
          reservationId: 'RES-001',
          customerName: 'Anura Kumara',
          email: 'anura@local.lk',
          phone: '+94 77 123 4567',
          date: '2026-06-16',
          time: '07:30 PM',
          guests: '4 Persons',
          tableType: 'Local',
          status: 'Confirmed',
          tableNumber: 'T01',
          checkedIn: true
        },
        {
          reservationId: 'RES-002',
          customerName: 'Lady Elizabeth',
          email: 'elizabeth@royal.uk',
          phone: '+44 20 7946 0192',
          date: '2026-06-16',
          time: '08:00 PM',
          guests: '2 Persons',
          tableType: 'VIP',
          status: 'Confirmed',
          tableNumber: 'VIP01',
          checkedIn: true
        },
        {
          reservationId: 'RES-003',
          customerName: 'Hans Mueller',
          email: 'hans.m@travel.de',
          phone: '+49 89 201934',
          date: '2026-06-17',
          time: '06:00 PM',
          guests: '3 Persons',
          tableType: 'Foreign',
          status: 'Pending',
          tableNumber: null,
          checkedIn: false
        }
      ];
      await Reservation.insertMany(seedReservations);
      reservations = await Reservation.find().sort({ createdAt: -1 });
    }
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const userAuth = require('../middleware/userAuth');

// POST /api/reservations - Save a new reservation
router.post('/', userAuth, async (req, res) => {
  const { customerName, email, phone, date, time, guests, tableType, specialRequests } = req.body;

  // Validate fields
  if (!customerName || !customerName.trim()) {
    return res.status(400).json({ message: 'Customer name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Email address is required.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }
  if (!date || !date.trim()) {
    return res.status(400).json({ message: 'Reservation date is required.' });
  }

  try {
    // Generate a unique reservation ID automatically
    let isUnique = false;
    let reservationId = '';
    while (!isUnique) {
      const rand = Math.floor(100 + Math.random() * 900);
      reservationId = `RES-${rand}`;
      const existing = await Reservation.findOne({ reservationId });
      if (!existing) {
        isUnique = true;
      }
    }

    const reservation = new Reservation({
      reservationId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date: date.trim(),
      time: time || '07:00 PM',
      guests: guests || '2 Persons',
      tableType: tableType || 'Local',
      specialRequests: specialRequests || '',
      status: 'Pending'
    });

    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/reservations/:id - Update reservation status, table allocation, or check-in
router.patch('/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.tableNumber !== undefined) updateData.tableNumber = req.body.tableNumber;
    if (req.body.checkedIn !== undefined) updateData.checkedIn = req.body.checkedIn;

    // Auto-deallocate table if status transitions to completed, cancelled or expired
    if (req.body.status === 'Completed' || req.body.status === 'Cancelled' || req.body.status === 'Expired') {
      updateData.tableNumber = null;
    }

    const updatedRes = await Reservation.findOneAndUpdate(
      { reservationId: req.params.id },
      updateData,
      { new: true }
    );

    if (!updatedRes) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(updatedRes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/reservations/:id - Get a reservation by reservationId
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reservations/:id - Delete a reservation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findOneAndDelete({ reservationId: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
