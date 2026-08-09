import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Award, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const QuizModal = ({ isOpen, onClose, moduleId, moduleTitle, onQuizCompleted }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen && moduleId) {
      const fetchQuiz = async () => {
        try {
          setLoading(true);
          setError(null);
          setResult(null);
          setSelectedAnswers({});
          const res = await api.get(`/quizzes/module/${moduleId}`);
          if (res.data && res.data.success) {
            setQuiz(res.data.data);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'No quiz available for this module yet.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuiz();
    }
  }, [isOpen, moduleId]);

  if (!isOpen) return null;

  const handleOptionSelect = (qIdx, optionIdx) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions) return;

    const answersArray = quiz.questions.map((_, idx) => 
      selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
    );

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/quizzes/module/${moduleId}/submit`, { answers: answersArray });

      if (res.data && res.data.success) {
        setResult(res.data.data);
        if (onQuizCompleted) {
          onQuizCompleted(res.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting quiz answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const questionsList = quiz && quiz.questions ? quiz.questions : [];
  const isAllAnswered = questionsList.length > 0 && 
    questionsList.every((_, idx) => selectedAnswers[idx] !== undefined);
  const passingScore = quiz?.passingScorePercent || 80;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-heading text-base text-neutral-900">Knowledge Check</h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  Passing Score: {passingScore}%
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">{moduleTitle || 'Module Assessment'}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold font-heading text-emerald-700">Loading Quiz Questions...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-700" />
              <span>{error}</span>
            </div>
          ) : questionsList.length === 0 ? (
            <div className="py-12 text-center space-y-3 text-neutral-500">
              <HelpCircle className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-700">No quiz questions have been added for this module yet.</p>
              <p className="text-xs">Trainers can add questions using the "Edit Quiz Questions" button.</p>
            </div>
          ) : (
            <>
              {/* Score Result Banner */}
              {result && (
                <div className={`p-5 rounded-2xl border ${result.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold font-heading text-base">
                      {result.passed ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <AlertCircle className="w-6 h-6 text-amber-700" />}
                      <span>{result.passed ? 'Knowledge Check Passed!' : 'Assessment Attempt Recorded'}</span>
                    </div>
                    <span className="text-xl font-extrabold font-heading">{result.scorePercent}%</span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed">
                    {result.passed 
                      ? `Great job! You scored ${result.scorePercent}%. This module has been marked as complete.` 
                      : `You scored ${result.scorePercent}%. Passing threshold is ${result.passingThreshold}%. Review the material and try again!`}
                  </p>

                  {result.certificateIssued && (
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <Award className="w-5 h-5" />
                      <span>🎉 Certificate Unlocked! ID: {result.certificateId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {questionsList.map((q, qIdx) => (
                  <div key={q._id || qIdx} className="p-5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        Q{qIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold font-heading text-neutral-900 pt-0.5">{q.questionText}</h4>
                    </div>

                    {/* Options Stack */}
                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = result && result.explanations && result.explanations[qIdx]?.correctOptionIndex === optIdx;
                        
                        let optionStyle = 'w-full p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800 text-sm font-medium transition-all text-left flex items-center gap-3 cursor-pointer shadow-xs';
                        if (isSelected) {
                          optionStyle = 'w-full p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 text-sm font-semibold transition-all text-left flex items-center gap-3 shadow-xs';
                        }
                        if (result) {
                          if (isCorrect) {
                            optionStyle = 'w-full p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-100/80 text-emerald-950 text-sm font-bold text-left flex items-center gap-3 shadow-xs';
                          } else if (isSelected && !result.passed) {
                            optionStyle = 'w-full p-3.5 rounded-xl border-2 border-amber-600 bg-amber-50 text-amber-950 text-sm font-semibold text-left flex items-center gap-3 shadow-xs';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={!!result}
                            onClick={() => handleOptionSelect(qIdx, optIdx)}
                            className={optionStyle}
                          >
                            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {result && result.explanations && result.explanations[qIdx]?.explanation && (
                      <div className="mt-2 text-xs text-neutral-600 italic bg-white p-3 rounded-lg border border-neutral-200">
                        <strong className="text-neutral-800">Explanation:</strong> {result.explanations[qIdx].explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
          >
            Close
          </button>

          {questionsList.length > 0 && !result && (
            <button
              type="button"
              disabled={!isAllAnswered || submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-2 border-0 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Evaluating...' : 'Submit Answers'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {result && !result.passed && (
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
              }}
              className="px-5 py-2.5 text-sm font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-2 border-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
