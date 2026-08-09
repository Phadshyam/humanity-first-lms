const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    number: {
      type: String,
      default: '01'
    },
    type: {
      type: String,
      default: 'Orientation'
    },
    title: {
      type: String,
      required: [true, 'Please provide a module title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    durationMinutes: {
      type: Number,
      default: 15
    },
    youtubeUrl: {
      type: String,
      trim: true
    },
    keyTakeaways: [
      {
        type: String
      }
    ],
    fullContent: {
      type: String,
      required: [true, 'Please provide full study content for this module']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Module', moduleSchema);
