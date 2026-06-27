const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const userAuth = require('../middleware/userAuth');

// Email regex helper
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Signup
router.post('/signup', async (req, res) => {
  const { firstName, email, password } = req.body;

  try {
    // 1. Validations
    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'All fields (First Name, Email Address, and Password) are required.' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    // 3. Create user
    const user = new User({ firstName, email, password });
    await user.save();

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET || 'leafora_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        firstName: user.firstName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validations
    if (!email || !password) {
      return res.status(400).json({ message: 'Email Address and Password are required.' });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    // 3. Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET || 'leafora_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        firstName: user.firstName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
});

// Get User Profile (Protected)
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      firstName: user.firstName,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
});

// Update User Profile (Protected)
router.put('/profile', userAuth, async (req, res) => {
  const { firstName, email } = req.body;

  try {
    // Validations
    if (!firstName || !email) {
      return res.status(400).json({ message: 'First Name and Email Address are required.' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Check if new email is taken by another user
    if (email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email address already exists.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a new token with updated information
    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email, firstName: updatedUser.firstName },
      process.env.JWT_SECRET || 'leafora_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        firstName: updatedUser.firstName,
        email: updatedUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
});

// Get User Orders (Protected)
router.get('/my-orders', userAuth, async (req, res) => {
  try {
    // Find all orders matching user's email
    const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
});

module.exports = router;
