const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_lms');
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Database connection failed: ${error.message}`);
    // Optional process.exit(1) commented out for non-blocking dev server boot without mongodb running
    console.warn('[MongoDB Warning] Proceeding without active MongoDB connection. Make sure MongoDB is running.');
  }
};

module.exports = connectDB;
