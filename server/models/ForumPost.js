const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const forumPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Field Notes', 'Policy Questions', 'Announcements'],
      default: 'Field Notes'
    },
    body: {
      type: String,
      required: [true, 'Please provide discussion body content'],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    replies: [replySchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ForumPost', forumPostSchema);
