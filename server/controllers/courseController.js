const Course = require('../models/Course');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

// @desc    Get primary published courses populated with modules sorted by module number
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: 'modules',
        options: { sort: { number: 1 } },
        select: 'number type title description durationMinutes youtubeUrl keyTakeaways fullContent'
      })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving courses',
      error: error.message
    });
  }
};

// @desc    Get single module by ID
// @route   GET /api/courses/modules/:id
// @access  Public
const getModuleById = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);

    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: moduleItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving module details',
      error: error.message
    });
  }
};

// @desc    Create a new module under a course
// @route   POST /api/courses/:courseId/modules
// @access  Private (Trainer/Admin)
const addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { number, type, title, description, durationMinutes, youtubeUrl, keyTakeaways, fullContent } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide module title and description'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Parent course not found'
      });
    }

    const newModule = await Module.create({
      courseId,
      number: number || '09',
      type: type || 'Orientation',
      title,
      description,
      durationMinutes: Number(durationMinutes) || 15,
      youtubeUrl: youtubeUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
      fullContent: fullContent || `### ${title}\n\nDetailed study content and operational field guidelines.`
    });

    course.modules.push(newModule._id);
    await course.save();

    return res.status(201).json({
      success: true,
      data: newModule
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating module',
      error: error.message
    });
  }
};

// @desc    Update a module by ID
// @route   PUT /api/courses/modules/:id
// @access  Private (Trainer/Admin)
const updateModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const { number, type, title, description, durationMinutes, youtubeUrl, keyTakeaways, fullContent } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      {
        ...(number !== undefined && { number }),
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(durationMinutes !== undefined && { durationMinutes: Number(durationMinutes) }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(keyTakeaways !== undefined && { keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [] }),
        ...(fullContent !== undefined && { fullContent })
      },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedModule
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating module',
      error: error.message
    });
  }
};

// @desc    Delete a module and perform cascade progress cleanup
// @route   DELETE /api/courses/modules/:id
// @access  Private (Trainer/Admin)
const deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;

    const moduleToDelete = await Module.findById(moduleId);
    if (!moduleToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // 1. Remove module ID reference from parent Course
    await Course.findByIdAndUpdate(moduleToDelete.courseId, {
      $pull: { modules: moduleId }
    });

    // 2. Delete matching Quiz document
    await Quiz.deleteMany({ moduleId });

    // 3. Delete Module document
    await Module.findByIdAndDelete(moduleId);

    // 4. CASCADE CLEANUP: Strip deleted module ID from all user progress records immediately
    await Progress.updateMany({}, { $pull: { completedModules: moduleId } });

    return res.status(200).json({
      success: true,
      message: 'Module deleted and user progress records sanitized successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting module',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getModuleById,
  addModule,
  updateModule,
  deleteModule
};
