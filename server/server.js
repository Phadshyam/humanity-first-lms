const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection with Embedded In-Memory Fallback & Auto-Seeding
let mongoMemoryServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_lms';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[Database] Connected to MongoDB at ${mongoUri}`);
  } catch (err) {
    console.warn(`[Database Warning] Local MongoDB connection at ${mongoUri} failed (${err.message}). Booting Embedded In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to Embedded In-Memory MongoDB Server at ${memUri}`);
    } catch (memErr) {
      console.error(`[Database Error] Embedded In-Memory MongoDB Server failed to boot: ${memErr.message}`);
    }
  }

  // Auto-seed initial accounts and course data if database is empty
  try {
    const User = require('./models/User');
    const { runSeedLogic } = require('./utils/seedData');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] Database is empty. Auto-seeding initial accounts and 8 orientation modules...');
      await runSeedLogic();
    }
  } catch (seedErr) {
    console.error('[Auto-Seed Error] Failed to auto-seed initial database:', seedErr.message);
  }
};

connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Humanity First LMS API Server is operational',
    timestamp: new Date()
  });
});

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Humanity First LMS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
