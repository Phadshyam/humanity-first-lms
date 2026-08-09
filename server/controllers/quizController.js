const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Get quiz by module ID
// @route   GET /api/quizzes/module/:moduleId
// @access  Public
const getQuizByModuleId = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const quiz = await Quiz.findOne({ moduleId });

    if (!quiz) {
      return res.status(200).json({
        success: true,
        data: {
          moduleId,
          title: 'Knowledge Check',
          passingScorePercent: 80,
          questions: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving quiz details',
      error: error.message
    });
  }
};

// @desc    Submit a quiz attempt and update user progress + certificate status
// @route   POST /api/quizzes/module/:moduleId/submit
// @access  Private (Protected)
const submitQuizAttempt = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { answers } = req.body; // Array of { questionIndex, selectedOptionIndex }

    const quiz = await Quiz.findOne({ moduleId });
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active quiz questions found for this module'
      });
    }

    // 1. Calculate Score Percentage
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q, idx) => {
      let selectedOption = -1;
      if (Array.isArray(answers)) {
        if (typeof answers[idx] === 'number') {
          selectedOption = answers[idx];
        } else if (typeof answers[idx] === 'object' && answers[idx] !== null) {
          selectedOption = Number(answers[idx].selectedOptionIndex !== undefined ? answers[idx].selectedOptionIndex : answers[idx]);
        } else {
          const found = answers.find(a => a && Number(a.questionIndex) === idx);
          if (found) selectedOption = Number(found.selectedOptionIndex);
        }
      }

      if (selectedOption === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passingThreshold = quiz.passingScorePercent || 80;
    const passed = scorePercent >= passingThreshold;

    // 2. Fetch or Initialize User Progress Record
    let progress = await Progress.findOne({ userId: req.user._id });
    
    // Find active course to associate if needed
    const primaryCourse = await Course.findOne({ isPublished: true });
    const courseId = primaryCourse ? primaryCourse._id : null;

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId,
        completedModules: [],
        quizAttempts: [],
        certificateIssued: false
      });
    }

    // 3. NON-DESTRUCTIVE APPEND: Push new attempt into history
    progress.quizAttempts.push({
      moduleId,
      scorePercent,
      passed,
      attemptedAt: new Date()
    });

    // 4. COMPLETION UPDATE: If passed, add moduleId to completedModules uniquely
    if (passed) {
      const existingCompleted = progress.completedModules.map(m => m.toString());
      if (!existingCompleted.includes(moduleId.toString())) {
        progress.completedModules.push(moduleId);
      }
    }

    // 5. CERTIFICATE AUTO-ISSUANCE CHECK
    let activeModulesCount = 8;
    if (primaryCourse && primaryCourse.modules) {
      activeModulesCount = primaryCourse.modules.length;
    }

    // Filter completedModules against active course modules
    const activeModuleIds = primaryCourse && primaryCourse.modules ? primaryCourse.modules.map(m => m.toString()) : [];
    const validCompletedCount = progress.completedModules.filter(id => activeModuleIds.includes(id.toString())).length;

    if (validCompletedCount >= activeModulesCount && activeModulesCount > 0) {
      if (!progress.certificateIssued) {
        progress.certificateIssued = true;
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        progress.certificateId = `CERT-HF-2026-${randomCode}`;
        progress.issuedAt = new Date();
      }
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      data: {
        scorePercent,
        passed,
        passingScorePercent: passingThreshold,
        completedModules: progress.completedModules,
        certificateIssued: progress.certificateIssued,
        certificateId: progress.certificateId,
        issuedAt: progress.issuedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error submitting quiz attempt',
      error: error.message
    });
  }
};

// @desc    Upsert or update quiz questions for a module
// @route   POST /api/quizzes/module/:moduleId
// @access  Private (Trainer/Admin)
const upsertQuizQuestions = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, passingScorePercent, questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Questions must be provided as an array'
      });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { moduleId },
      {
        moduleId,
        title: title || 'Knowledge Check',
        passingScorePercent: Number(passingScorePercent) || 80,
        questions
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error saving quiz questions',
      error: error.message
    });
  }
};

module.exports = {
  getQuizByModuleId,
  submitQuizAttempt,
  upsertQuizQuestions
};
