import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, X, Check, Save } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';

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
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 1,
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
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF7] rounded-2xl border border-[#D4CEC0] max-w-3xl w-full shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F5F1E8] px-6 py-4 border-b border-[#D4CEC0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#176B4D]" />
            <h3 className="font-extrabold font-heading text-lg text-[#24302B]">
              Quiz Editor — {moduleTitle || 'Module'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#5C665F] hover:text-[#24302B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-[#F0D4C3] text-[#C96B3C] text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-[#D4CEC0]">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                required
                value={passingScorePercent}
                onChange={(e) => setPassingScorePercent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-mono"
              />
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-heading text-[#24302B]">
                Questions List ({questions.length})
              </h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="gap-1">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-[#176B4D]">Loading quiz questions...</div>
            ) : (
              questions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl border border-[#D4CEC0] bg-[#F5F1E8]/50 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-[#D4CEC0] pb-2">
                    <span className="text-xs font-mono font-bold text-[#176B4D]">
                      Question {qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="p-1 text-[#C96B3C] hover:bg-[#F0D4C3] rounded-lg transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#5C665F] mb-1">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#FFFDF7] text-[#24302B] text-xs font-sans"
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full text-[10px] font-bold font-mono flex items-center justify-center shrink-0 ${
                          q.correctOptionIndex === oIdx ? 'bg-[#176B4D] text-[#FFFDF7]' : 'bg-[#E9E4D8] text-[#24302B]'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#D4CEC0] bg-[#FFFDF7] text-[#24302B] text-xs font-sans"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Option Selector & Explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#5C665F] mb-1">
                        Correct Choice
                      </label>
                      <select
                        value={q.correctOptionIndex}
                        onChange={(e) => handleQuestionChange(qIdx, 'correctOptionIndex', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D4CEC0] bg-[#FFFDF7] text-[#24302B] text-xs font-mono"
                      >
                        {q.options.map((_, oIdx) => (
                          <option key={oIdx} value={oIdx}>
                            Option {String.fromCharCode(65 + oIdx)} ({oIdx + 1})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-[#5C665F] mb-1">
                        Explanatory Feedback
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        placeholder="Explain why this choice is correct..."
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D4CEC0] bg-[#FFFDF7] text-[#24302B] text-xs font-sans"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-[#D4CEC0] flex items-center justify-end gap-3 shrink-0">
            <Button variant="quiet" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting} className="gap-2">
              <Save className="w-4 h-4" /> {submitting ? 'Saving Quiz...' : `Save Quiz (${questions.length} Questions)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizEditorModal;
