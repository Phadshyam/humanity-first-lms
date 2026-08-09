const express = require('express');
const router = express.Router();
const {
  getQuizByModuleId,
  submitQuizAttempt,
  upsertQuizQuestions
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/module/:moduleId', getQuizByModuleId);
router.post('/module/:moduleId/submit', protect, submitQuizAttempt);
router.post('/module/:moduleId', protect, authorize('trainer', 'admin'), upsertQuizQuestions);

module.exports = router;
