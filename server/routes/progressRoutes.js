const express = require('express');
const router = express.Router();
const { getUserProgress, resetUserProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserProgress);
router.post('/reset', protect, resetUserProgress);

module.exports = router;
