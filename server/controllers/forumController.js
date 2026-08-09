const ForumPost = require('../models/ForumPost');

// @desc    Get all community noticeboard forum posts with optional category filter
// @route   GET /api/forum
// @access  Public
const getForumPosts = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};
    if (category && category !== 'All Posts') {
      query.category = category;
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name role')
      .populate('replies.author', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving forum posts',
      error: error.message
    });
  }
};

// @desc    Create a new community noticeboard forum post
// @route   POST /api/forum
// @access  Private (Protected)
const createForumPost = async (req, res) => {
  try {
    const { title, body, category } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide post title and body content'
      });
    }

    const newPost = await ForumPost.create({
      title,
      body,
      category: category || 'Field Notes',
      author: req.user._id,
      replies: []
    });

    const populatedPost = await ForumPost.findById(newPost._id)
      .populate('author', 'name role')
      .populate('replies.author', 'name role');

    return res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating forum post',
      error: error.message
    });
  }
};

// @desc    Add a reply comment to a forum post
// @route   POST /api/forum/:postId/reply
// @access  Private (Protected)
const addReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reply text'
      });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Forum post thread not found'
      });
    }

    post.replies.push({
      author: req.user._id,
      body: body.trim(),
      createdAt: new Date()
    });

    await post.save();

    const updatedPost = await ForumPost.findById(postId)
      .populate('author', 'name role')
      .populate('replies.author', 'name role');

    return res.status(200).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error adding reply to thread',
      error: error.message
    });
  }
};

// @desc    Delete a forum thread
// @route   DELETE /api/forum/:postId
// @access  Private (Trainer/Admin)
const deleteForumPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Forum post thread not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Forum thread deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting forum post',
      error: error.message
    });
  }
};

module.exports = {
  getForumPosts,
  createForumPost,
  addReply,
  deleteForumPost
};
