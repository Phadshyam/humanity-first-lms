const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      required: true
    }
  ],
  correctOptionIndex: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
      unique: true
    },
    title: {
      type: String,
      trim: true
    },
    passingScorePercent: {
      type: Number,
      default: 80
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
