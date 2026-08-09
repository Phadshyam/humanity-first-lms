import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, X, Save } from 'lucide-react';
import api from '../../services/api';

const QuizEditorModal = ({ isOpen, onClose, moduleId, moduleTitle, onSaved }) => {
  const [title, setTitle] = useState('Module Knowledge Check');
  const [passingScorePercent, setPassingScorePercent] = useState(80);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !moduleId) return;

    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/quizzes/module/${moduleId}`);
        if (res.data && res.data.success && res.data.data) {
          const quiz = res.data.data;
          setTitle(quiz.title || `${moduleTitle || 'Module'} Knowledge Check`);
          setPassingScorePercent(quiz.passingScorePercent || 80);
          setQuestions(quiz.questions && quiz.questions.length > 0 ? quiz.questions : getDefaultQuestions());
        } else {
          setQuestions(getDefaultQuestions());
        }
      } catch (err) {
        setQuestions(getDefaultQuestions());
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [isOpen, moduleId, moduleTitle]);

  const getDefaultQuestions = () => [
    {
      questionText: 'Sample Question 1?',
      options: ['Option A choice text', 'Option B choice text', 'Option C choice text', 'Option D choice text'],
      correctOptionIndex: 0,
      explanation: 'Explanation for correct answer.'
    }
  ];

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: `New Question ${questions.length + 1}?`,
        options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
        correctOptionIndex: 0,
        explanation: 'Explanation of correct answer.'
      }
    ]);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length <= 1) {
      alert('A quiz must contain at least 1 question.');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a quiz title.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title,
        passingScorePercent: Number(passingScorePercent),
        questions
      };

      const res = await api.post(`/quizzes/module/${moduleId}`, payload);
      if (res.data && res.data.success) {
        if (onSaved) onSaved(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-lg text-neutral-900">
              Quiz Editor — {moduleTitle || 'Module'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Settings Header Card (2-Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 pb-5 border-b border-neutral-200">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Module 01 Knowledge Check"
                className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none text-neutral-900 font-medium"
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
                Passing Score (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={50}
                  max={100}
                  required
                  value={passingScorePercent}
                  onChange={(e) => setPassingScorePercent(e.target.value)}
                  className="w-full px-3.5 py-2 pr-8 border border-neutral-300 rounded-xl text-sm font-mono text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-heading text-neutral-900">
                Questions List ({questions.length})
              </h4>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-emerald-700">Loading quiz questions...</div>
            ) : (
              questions.map((q, qIdx) => (
                <div key={qIdx} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-4 relative shadow-xs">
                  <div className="text-sm font-bold text-neutral-800 flex items-center justify-between pb-3 border-b border-neutral-200">
                    <span className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider">
                      Question {qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Prompt */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                      placeholder="Enter question text here..."
                      className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-neutral-900 font-medium"
                    />
                  </div>

                  {/* 4 Options Layout (Full Width Stacked Rows) */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase text-neutral-600 mb-1">
                      Answer Choices
                    </label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                          q.correctOptionIndex === oIdx ? 'bg-emerald-700 text-white' : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)} choice text`}
                          className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-neutral-900"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Option Selector & Explanatory Feedback */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
                        Correct Choice
                      </label>
                      <select
                        value={q.correctOptionIndex}
                        onChange={(e) => handleQuestionChange(qIdx, 'correctOptionIndex', Number(e.target.value))}
                        className="w-48 px-3 py-2 border border-neutral-300 rounded-xl text-sm bg-white font-medium text-neutral-800 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {q.options.map((_, oIdx) => (
                          <option key={oIdx} value={oIdx}>
                            Option {String.fromCharCode(65 + oIdx)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
                        Explanatory Feedback
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        placeholder="Explain why this choice is correct..."
                        className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* "+ Add Question" Button */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 border-2 border-dashed border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-neutral-600 hover:text-emerald-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer bg-transparent"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {/* Footer Save / Cancel */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-2 border-0 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Quiz...' : `Save Quiz (${questions.length} Questions)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizEditorModal;
