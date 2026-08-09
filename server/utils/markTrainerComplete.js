const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Progress = require('../models/Progress');

dotenv.config();

const markTrainerComplete = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_lms';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`[Script] Connected to MongoDB at ${mongoUri}`);

    // 1. Target Account: Find Trainer Shyam Phad
    const trainer = await User.findOne({ email: 'shyamphad03@gmail.com' });
    if (!trainer) {
      console.error('[Script Error] Trainer account shyamphad03@gmail.com not found in User collection.');
      process.exit(1);
    }

    // 2. Fetch Course & all 8 published modules
    const course = await Course.findOne();
    const modules = await Module.find().sort({ number: 1 });

    if (!course || modules.length === 0) {
      console.error('[Script Error] Course or modules not found in database.');
      process.exit(1);
    }

    // Fetch existing Progress document or instantiate new progress object
    let progress = await Progress.findOne({ userId: trainer._id, courseId: course._id });
    if (!progress) {
      progress = new Progress({
        userId: trainer._id,
        courseId: course._id,
        completedModules: [],
        quizAttempts: [],
        certificateIssued: false
      });
    }

    // 3. Non-Destructive Merge Logic
    // Keep all existing quizAttempts intact. DO NOT overwrite or clear existing array.
    modules.forEach((mod) => {
      const modIdStr = mod._id.toString();

      // Check completedModules array
      const isCompleted = progress.completedModules.some(
        (id) => String(id._id || id) === modIdStr
      );
      if (!isCompleted) {
        progress.completedModules.push(mod._id);
      }

      // Check quizAttempts array
      const hasAttempt = progress.quizAttempts.some(
        (att) => String(att.moduleId._id || att.moduleId) === modIdStr
      );
      if (!hasAttempt) {
        progress.quizAttempts.push({
          moduleId: mod._id,
          scorePercent: 100,
          passed: true,
          attemptedAt: new Date()
        });
      }
    });

    progress.certificateIssued = true;
    if (!progress.certificateId) {
      progress.certificateId = 'CERT-HF-2026-SP01';
    }
    progress.issuedAt = progress.issuedAt || new Date();

    // 4. Save & Log
    await progress.save();
    console.log(`Trainer Shyam Phad progress merged successfully. Total attempts preserved: ${progress.quizAttempts.length}`);
    process.exit(0);
  } catch (error) {
    if (error.message && error.message.includes('ECONNREFUSED')) {
      console.log('[Script Note] Local MongoDB service is currently offline. Start local mongod on port 27017 to apply database updates.');
      process.exit(0);
    }
    console.error(`[Script Error] Failed to update trainer progress: ${error.message}`);
    process.exit(1);
  }
};

markTrainerComplete();
