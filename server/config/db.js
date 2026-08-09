const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_lms';

  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('[MongoDB] Connected via Serverless Engine');
  } catch (error) {
    console.error('[MongoDB Error] Primary Connection Error:', error.message);
    
    // Attempt embedded memory server fallback (for local dev or serverless test environments)
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      const memUri = memServer.getUri();
      await mongoose.connect(memUri);
      isConnected = true;
      console.log(`[MongoDB] Connected to Embedded In-Memory MongoDB at ${memUri}`);
      return;
    } catch (memErr) {
      console.error('[MongoDB Error] In-Memory Fallback Error:', memErr.message);
    }

    throw new Error(`Database connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
