import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Award, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface rounded-2xl border border-line-border max-w-2xl w-full shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-bg-warm px-6 py-4 border-b border-line-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-forest-green text-surface rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold font-heading text-lg text-ink">Knowledge Check</h3>
              <p className="text-xs text-muted-text">{moduleTitle || 'Module Assessment'}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-muted-text hover:text-ink rounded-lg hover:bg-alt-bg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold font-heading text-forest-green">Loading Quiz Questions...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-terracotta-soft text-terracotta text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : questionsList.length === 0 ? (
            <div className="py-12 text-center space-y-3 text-muted-text">
              <HelpCircle className="w-10 h-10 mx-auto text-muted-text/50" />
              <p className="text-sm font-semibold">No quiz questions have been added for this module yet.</p>
              <p className="text-xs">Trainers can add questions using the "Edit Quiz Questions" button.</p>
            </div>
          ) : (
            <>
              {/* Score Result Banner */}
              {result && (
                <div className={`p-5 rounded-2xl border ${result.passed ? 'bg-green-soft border-forest-green/30 text-forest-green' : 'bg-terracotta-soft border-terracotta/30 text-terracotta'} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold font-heading text-base">
                      {result.passed ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      <span>{result.passed ? 'Knowledge Check Passed!' : 'Assessment Attempt Recorded'}</span>
                    </div>
                    <span className="text-xl font-extrabold font-heading">{result.scorePercent}%</span>
                  </div>

                  <p className="text-xs">
                    {result.passed 
                      ? `Great job! You scored ${result.scorePercent}%. This module has been marked as complete.` 
                      : `You scored ${result.scorePercent}%. Passing threshold is ${result.passingThreshold}%. Review the material and try again!`}
                  </p>

                  {result.certificateIssued && (
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-forest-green">
                      <Award className="w-5 h-5" />
                      <span>🎉 Certificate Unlocked! ID: {result.certificateId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {questionsList.map((q, qIdx) => (
                  <div key={q._id || qIdx} className="p-4 rounded-xl bg-bg-warm border border-line-border space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-forest-green text-surface rounded text-xs font-mono font-bold">
                        Q{qIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold font-heading text-ink">{q.questionText}</h4>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pl-7">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = result && result.explanations && result.explanations[qIdx]?.correctOptionIndex === optIdx;
                        
                        let optionStyle = 'bg-surface border-line-border text-ink hover:bg-alt-bg';
                        if (isSelected) optionStyle = 'bg-forest-green/10 border-forest-green text-forest-green font-semibold';
                        if (result) {
                          if (isCorrect) optionStyle = 'bg-green-soft border-forest-green text-forest-green font-bold';
                          else if (isSelected && !result.passed) optionStyle = 'bg-terracotta-soft border-terracotta text-terracotta';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={!!result}
                            onClick={() => handleOptionSelect(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-forest-green"></span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {result && result.explanations && result.explanations[qIdx]?.explanation && (
                      <div className="mt-2 pl-7 text-xs text-muted-text italic">
                        <strong>Explanation:</strong> {result.explanations[qIdx].explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-bg-warm px-6 py-4 border-t border-line-border flex items-center justify-between">
          <Button variant="quiet" size="sm" onClick={onClose}>
            Close
          </Button>

          {questionsList.length > 0 && !result && (
            <Button
              variant="primary"
              size="sm"
              disabled={!isAllAnswered || submitting}
              onClick={handleSubmit}
              className="gap-2"
            >
              {submitting ? 'Evaluating...' : 'Submit Answers'} <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {result && !result.passed && (
            <Button
              variant="terracotta"
              size="sm"
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
              }}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
