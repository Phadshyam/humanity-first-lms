const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

  // In production (Vercel), MONGO_URI is required — no fallback possible
  if (!mongoUri && isProduction) {
    throw new Error(
      'MONGO_URI environment variable is not set. ' +
      'Please add it in Vercel Dashboard → Settings → Environment Variables.'
    );
  }

  const connectionUri = mongoUri || 'mongodb://localhost:27017/ngo_lms';

  try {
    const db = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('[MongoDB] Connected successfully');
  } catch (error) {
    console.error('[MongoDB Error] Connection failed:', error.message);
    console.error('[MongoDB Debug] URI starts with:', connectionUri.substring(0, 20) + '...');
    console.error('[MongoDB Debug] MONGO_URI env set:', !!process.env.MONGO_URI);
    console.error('[MongoDB Debug] NODE_ENV:', process.env.NODE_ENV);
    console.error('[MongoDB Debug] VERCEL:', process.env.VERCEL);

    // Only attempt in-memory fallback in LOCAL development (never on Vercel)
    if (!isProduction) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const memServer = await MongoMemoryServer.create();
        const memUri = memServer.getUri();
        await mongoose.connect(memUri);
        isConnected = true;
        console.log(`[MongoDB] Connected to In-Memory MongoDB (local dev only)`);
        return;
      } catch (memErr) {
        console.error('[MongoDB Error] In-Memory Fallback Error:', memErr.message);
      }
    }

    throw new Error(`Database connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
