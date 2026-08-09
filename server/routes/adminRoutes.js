const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createUser,
  exportCSV
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('trainer', 'admin'), getAdminStats);
router.get('/users', protect, authorize('trainer', 'admin'), getUsers);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/export-csv', protect, authorize('trainer', 'admin'), exportCSV);

module.exports = router;
