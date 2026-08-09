import React, { useState } from 'react';
import { MessageSquare, X, Send, User as UserIcon } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24302B]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF7] rounded-2xl border border-[#D4CEC0] max-w-2xl w-full shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#F5F1E8] px-6 py-4 border-b border-[#D4CEC0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#176B4D]" />
            <h3 className="font-extrabold font-heading text-lg text-[#24302B]">Discussion Thread</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#5C665F] hover:text-[#24302B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Thread Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Original Post */}
          <div className="space-y-4 pb-6 border-b border-[#D4CEC0]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0D4C3] text-[#C96B3C] font-extrabold text-sm flex items-center justify-center font-mono shrink-0">
                  {getInitial(authorName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-heading text-[#24302B]">{authorName}</span>
                    <Badge role={authorRole} className="text-[9px] py-0 px-1.5">{authorRole}</Badge>
                    <span className="text-xs text-[#5C665F]">• {postDate}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C96B3C] bg-[#E9E4D8] px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                    {thread.category || 'Field Notes'}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-extrabold font-heading text-[#24302B] leading-snug">
              {thread.title}
            </h2>

            <p className="text-sm text-[#5C665F] leading-relaxed font-sans whitespace-pre-line">
              {thread.body}
            </p>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-heading text-[#24302B]">
              Replies ({repliesList.length})
            </h4>

            {repliesList.length > 0 ? (
              <div className="space-y-3">
                {repliesList.map((reply, rIdx) => {
                  const replyAuthorName = reply.author ? reply.author.name : 'Member';
                  const replyAuthorRole = reply.author ? reply.author.role : 'volunteer';
                  const replyDate = reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-US') : '';

                  return (
                    <div key={reply._id || rIdx} className="p-4 rounded-xl bg-[#F5F1E8] border border-[#D4CEC0] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#D8E8DD] text-[#176B4D] font-bold text-xs flex items-center justify-center font-mono shrink-0">
                            {getInitial(replyAuthorName)}
                          </div>
                          <span className="text-xs font-bold font-heading text-[#24302B]">{replyAuthorName}</span>
                          <Badge role={replyAuthorRole} className="text-[8px] py-0 px-1">{replyAuthorRole}</Badge>
                        </div>
                        <span className="text-[10px] text-[#5C665F] font-mono">{replyDate}</span>
                      </div>

                      <p className="text-xs text-[#5C665F] font-sans pl-9 leading-relaxed">
                        {reply.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#5C665F] italic">No replies yet. Be the first to share field thoughts!</p>
            )}
          </div>
        </div>

        {/* Add Reply Form Footer */}
        <form onSubmit={handleReplySubmit} className="p-4 bg-[#F5F1E8] border-t border-[#D4CEC0] space-y-3 shrink-0">
          {error && (
            <div className="p-2 rounded-lg bg-[#F0D4C3] text-[#C96B3C] text-xs font-semibold">
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
              className="flex-1 px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#FFFDF7] text-xs text-[#24302B] focus:outline-none focus:ring-1 focus:ring-[#176B4D] font-sans"
            />
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={submitting}
              className="self-end gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Reply'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThreadDetailModal;
