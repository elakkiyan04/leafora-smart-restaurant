const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/leafora';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123' // You should change this in production
      });
      await admin.save();
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
