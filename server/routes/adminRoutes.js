const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  exportCSV
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('trainer', 'admin'), getAdminStats);
router.get('/users', protect, authorize('trainer', 'admin'), getUsers);
router.get('/export-csv', protect, authorize('trainer', 'admin'), exportCSV);

module.exports = router;
