const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  scorePercent: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
      }
    ],
    quizAttempts: [quizAttemptSchema],
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateId: {
      type: String
    },
    issuedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Progress', progressSchema);
