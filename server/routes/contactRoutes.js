const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// GET /api/contact - Retrieve all contact messages, newest first
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: unable to retrieve messages.' });
  }
});

// POST /api/contact - Save a new contact message
router.post('/', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  // 1. Empty field validation & Prevent blank submissions
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ success: false, message: 'First name is required and cannot be blank.' });
  }
  if (!lastName || !lastName.trim()) {
    return res.status(400).json({ success: false, message: 'Last name is required and cannot be blank.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required and cannot be blank.' });
  }
  if (!subject || !subject.trim()) {
    return res.status(400).json({ success: false, message: 'Subject is required and cannot be blank.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required and cannot be blank.' });
  }

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  try {
    const newMessage = new ContactMessage({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: could not save the message. Please try again later.'
    });
  }
});

// DELETE /api/contact/:id - Delete a contact message
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: unable to delete message.' });
  }
});

module.exports = router;
