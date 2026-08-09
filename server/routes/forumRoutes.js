const express = require('express');
const router = express.Router();
const {
  getForumPosts,
  createForumPost,
  addReply,
  deleteForumPost
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getForumPosts);
router.post('/', protect, createForumPost);
router.post('/:postId/reply', protect, addReply);
router.delete('/:postId', protect, authorize('trainer', 'admin'), deleteForumPost);

module.exports = router;
