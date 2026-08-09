const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS configuration supporting local dev and Vercel deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for production deployment
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();

    // Auto-seed initial accounts and course data if database is empty
    if (mongoose.connection.readyState === 1) {
      try {
        const User = require('./models/User');
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('[Auto-Seed] Database is empty. Auto-seeding initial accounts and 8 orientation modules...');
          const { runSeedLogic } = require('./utils/seedData');
          await runSeedLogic();
        }
      } catch (seedErr) {
        console.error('[Auto-Seed Error] Failed to auto-seed initial database:', seedErr.message);
      }
    }

    next();
  } catch (err) {
    console.error('[DB Middleware Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please verify MONGO_URI in Vercel Environment Variables.',
      error: err.message
    });
  }
});

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

// Root API Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Humanity First LMS API Gateway operational'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] Humanity First LMS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
