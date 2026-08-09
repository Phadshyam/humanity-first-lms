const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Module = require('../models/Module');

// @desc    Get current logged-in user's sanitized progress
// @route   GET /api/progress
// @access  Private (Protected)
const getUserProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id })
      .populate('completedModules')
      .populate('courseId');

    const primaryCourse = await Course.findOne({ isPublished: true }).populate('modules');
    const activeModuleIds = new Set(
      primaryCourse && primaryCourse.modules
        ? primaryCourse.modules.map(m => String(m._id || m))
        : []
    );

    if (!progress) {
      // Initialize fresh progress record if none exists
      progress = await Progress.create({
        userId: req.user._id,
        courseId: primaryCourse ? primaryCourse._id : null,
        completedModules: [],
        quizAttempts: [],
        certificateIssued: false
      });
    }

    // MATH SANITIZATION: Filter completedModules against active course modules
    if (progress.completedModules && progress.completedModules.length > 0) {
      progress.completedModules = progress.completedModules.filter(mod => {
        const modIdStr = String(mod._id || mod);
        return activeModuleIds.has(modIdStr);
      });
    }

    return res.status(200).json({
      success: true,
      count: 1,
      data: [progress]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user progress',
      error: error.message
    });
  }
};

// @desc    Reset logged-in user's progress to zero for testing
// @route   POST /api/progress/reset
// @access  Private (Protected)
const resetUserProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });

    if (progress) {
      progress.completedModules = [];
      progress.quizAttempts = [];
      progress.certificateIssued = false;
      progress.certificateId = undefined;
      progress.issuedAt = undefined;
      await progress.save();
    } else {
      const primaryCourse = await Course.findOne({ isPublished: true });
      progress = await Progress.create({
        userId: req.user._id,
        courseId: primaryCourse ? primaryCourse._id : null,
        completedModules: [],
        quizAttempts: [],
        certificateIssued: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Progress reset to 0% baseline successfully',
      data: progress
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error resetting progress',
      error: error.message
    });
  }
};

module.exports = {
  getUserProgress,
  resetUserProgress
};
