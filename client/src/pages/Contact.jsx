import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Share2, Globe } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, subject, message } = formData;

    // Field validations
    if (!firstName || !firstName.trim()) {
      toast.error('First Name is required');
      return;
    }
    if (!lastName || !lastName.trim()) {
      toast.error('Last Name is required');
      return;
    }
    if (!email || !email.trim()) {
      toast.error('Email Address is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!subject || !subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!message || !message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/contact', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        subject: subject,
        message: message.trim()
      });

      if (response.data.success) {
        toast.success(
          "✓ Thank you for contacting Leafora.\nWe have received your message and will respond soon."
        );

        // Clear all form fields & reset dropdown
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(error.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold mb-4">Get in <span className="text-primary">Touch</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Have questions or want to make a reservation? We're here to help you.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Contact Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-glow">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Email</p>
                  <p className="text-white font-medium">hello@leafora.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-glow">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Phone</p>
                  <p className="text-white font-medium">0742840354</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-glow">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Location</p>
                  <p className="text-white font-medium">Mullaitivu Visuvamadu</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-6">Follow Us</p>
              <div className="flex gap-4">
                {[Globe, Share2].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <h3 className="text-xl font-bold mb-4 relative z-10">Opening Hours</h3>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between">
                <span className="text-gray-400">Mon - Thu</span>
                <span className="text-white font-medium">11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fri - Sun</span>
                <span className="text-white font-medium">10:00 AM - 11:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 w-full">
          <div className="glass-panel p-8 md:p-12 rounded-3xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-darkBg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-darkBg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-darkBg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-darkBg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                >
                  <option>General Inquiry</option>
                  <option>Reservation</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full bg-darkBg border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
