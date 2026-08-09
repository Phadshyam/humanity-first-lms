const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      default: 'Orientation'
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
