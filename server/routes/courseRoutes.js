const express = require('express');
const router = express.Router();
const {
  getCourses,
  getModuleById,
  addModule,
  updateModule,
  deleteModule
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/modules/:id', getModuleById);
router.post('/:courseId/modules', protect, authorize('trainer', 'admin'), addModule);
router.put('/modules/:id', protect, authorize('trainer', 'admin'), updateModule);
router.delete('/modules/:id', protect, authorize('trainer', 'admin'), deleteModule);

module.exports = router;
