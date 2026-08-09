import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../../services/api';
import Badge from '../common/Badge';

const ThreadDetailModal = ({ isOpen, onClose, thread, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !thread) return null;

  const getInitial = (name) => {
    if (!name) return 'H';
    return name.charAt(0).toUpperCase();
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/forum/${thread._id}/reply`, { body: replyText });
      if (res.data && res.data.success) {
        setReplyText('');
        if (onReplyAdded) onReplyAdded(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const authorName = thread.author ? thread.author.name : 'Learner';
  const authorRole = thread.author ? thread.author.role : 'volunteer';
  const postDate = new Date(thread.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const repliesList = thread.replies || [];

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-lg text-neutral-900">Discussion Thread</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Thread Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
          {/* Main Original Post */}
          <div className="space-y-4 pb-6 border-b border-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center font-mono shrink-0 border border-emerald-200">
                  {getInitial(authorName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-heading text-neutral-900">{authorName}</span>
                    <Badge role={authorRole} className="text-[9px] py-0 px-1.5">{authorRole}</Badge>
                    <span className="text-xs text-neutral-400">• {postDate}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase inline-block mt-1">
                    {thread.category || 'Field Notes'}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold font-heading text-neutral-900 leading-snug">
              {thread.title}
            </h2>

            <p className="text-sm text-neutral-700 leading-relaxed font-sans whitespace-pre-line">
              {thread.body}
            </p>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-heading text-neutral-900">
              Replies ({repliesList.length})
            </h4>

            {repliesList.length > 0 ? (
              <div className="space-y-3">
                {repliesList.map((reply, rIdx) => {
                  const replyAuthorName = reply.author ? reply.author.name : 'Member';
                  const replyAuthorRole = reply.author ? reply.author.role : 'volunteer';
                  const replyDate = reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-US') : '';

                  return (
                    <div key={reply._id || rIdx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0">
                            {getInitial(replyAuthorName)}
                          </div>
                          <span className="text-xs font-bold font-heading text-neutral-900">{replyAuthorName}</span>
                          <Badge role={replyAuthorRole} className="text-[8px] py-0 px-1">{replyAuthorRole}</Badge>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">{replyDate}</span>
                      </div>

                      <p className="text-xs text-neutral-700 font-sans pl-9 leading-relaxed">
                        {reply.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">No replies yet. Be the first to share field thoughts!</p>
            )}
          </div>
        </div>

        {/* Add Reply Form Footer */}
        <form onSubmit={handleReplySubmit} className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3 shrink-0 font-sans">
          {error && (
            <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              required
              rows={2}
              placeholder="Write a respectful reply or field note..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-0 disabled:opacity-50 self-end shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThreadDetailModal;
