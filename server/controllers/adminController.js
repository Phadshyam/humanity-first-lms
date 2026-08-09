const User = require('../models/User');
const Progress = require('../models/Progress');
const Module = require('../models/Module');

// @desc    Get live administrative stats directly from MongoDB
// @route   GET /api/admin/stats
// @access  Private (Trainer/Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allProgress = await Progress.find({});

    // Active Learners: Count unique users in allProgress with at least 1 attempt or completed module
    const activeLearnersList = allProgress.filter(p => 
      (p.quizAttempts && p.quizAttempts.length > 0) || 
      (p.completedModules && p.completedModules.length > 0)
    );
    const activeLearners = activeLearnersList.length;

    // Completed Learners & Total Certificates: Count unique users with certificateIssued === true OR completedModules >= 8
    const completedLearners = allProgress.filter(p => 
      p.certificateIssued === true || (p.completedModules && p.completedModules.length >= 8)
    ).length;

    // Completion Rate %
    const completionRate = activeLearners > 0 
      ? Math.round((completedLearners / activeLearners) * 100) 
      : 0;

    // Average Quiz Score % Across Network
    let totalScoreSum = 0;
    let totalAttemptsCount = 0;

    allProgress.forEach(p => {
      if (p.quizAttempts && p.quizAttempts.length > 0) {
        p.quizAttempts.forEach(attempt => {
          totalScoreSum += (attempt.scorePercent || 0);
          totalAttemptsCount += 1;
        });
      }
    });

    const averageScore = totalAttemptsCount > 0 
      ? Math.round(totalScoreSum / totalAttemptsCount) 
      : 0;

    // Per-Module Stats Array
    const allModules = await Module.find({}).sort({ number: 1 });

    const moduleStats = allModules.map(mod => {
      let modScoreSum = 0;
      let modAttemptsCount = 0;

      allProgress.forEach(p => {
        if (p.quizAttempts) {
          p.quizAttempts.forEach(att => {
            if (att.moduleId && att.moduleId.toString() === mod._id.toString()) {
              modScoreSum += (att.scorePercent || 0);
              modAttemptsCount += 1;
            }
          });
        }
      });

      return {
        moduleId: mod._id,
        title: mod.title,
        number: mod.number,
        type: mod.type,
        attempts: modAttemptsCount,
        averageScore: modAttemptsCount > 0 ? Math.round(modScoreSum / modAttemptsCount) : 0
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeLearners,
        completedLearners,
        completionRate,
        averageScore,
        totalCertificates: completedLearners,
        moduleStats
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics',
      error: error.message
    });
  }
};

// @desc    Get all registered users for administration
// @route   GET /api/admin/users
// @access  Private (Trainer/Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving users list',
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin Only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating user role',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own active admin session' });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message
    });
  }
};

// @desc    Create new user manually from admin panel
// @route   POST /api/admin/users
// @access  Private (Admin Only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password).trim(),
      role: role || 'volunteer',
      preferredLanguage: preferredLanguage || 'EN'
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error creating user',
      error: error.message
    });
  }
};

// @desc    Export CSV report of learners progress and certificates directly from MongoDB
// @route   GET /api/admin/export-csv
// @access  Private (Trainer/Admin)
const exportCSV = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const allProgress = await Progress.find().populate('completedModules');

    // CSV Header row
    let csvString = 'Name,Email,Role,Preferred Language,Completed Modules Count,Total Attempts,Avg Quiz Score %,Certificate Issued,Certificate ID,Joined Date\n';

    users.forEach(u => {
      const uId = u._id ? u._id.toString() : '';
      const uProg = allProgress.find(p => p.userId && p.userId.toString() === uId);

      const completedCount = uProg && uProg.completedModules ? uProg.completedModules.length : 0;
      const totalAttempts = uProg && uProg.quizAttempts ? uProg.quizAttempts.length : 0;
      
      let avgScore = 0;
      if (uProg && uProg.quizAttempts && uProg.quizAttempts.length > 0) {
        const sum = uProg.quizAttempts.reduce((acc, curr) => acc + (curr.scorePercent || 0), 0);
        avgScore = Math.round(sum / uProg.quizAttempts.length);
      }

      const certIssued = uProg ? ((uProg.certificateIssued || completedCount >= 8) ? 'Yes' : 'No') : 'No';
      const certId = uProg ? uProg.certificateId || 'N/A' : 'N/A';
      const joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-08-08';

      // Clean string fields for CSV safety
      const safeName = `"${(u.name || '').replace(/"/g, '""')}"`;
      const safeEmail = `"${(u.email || '').replace(/"/g, '""')}"`;

      csvString += `${safeName},${safeEmail},${u.role || 'volunteer'},${u.preferredLanguage || 'EN'},${completedCount},${totalAttempts},${avgScore}%,${certIssued},${certId},${joinedDate}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=NGO_LMS_Learner_Report_2026.csv');
    return res.status(200).send(csvString);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error generating CSV export',
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createUser,
  exportCSV
};
