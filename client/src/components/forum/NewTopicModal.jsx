import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../../services/api';

const NewTopicModal = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Field Notes');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and message body.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post('/forum', { title, category, body });
      if (res.data && res.data.success) {
        setTitle('');
        setBody('');
        setCategory('Field Notes');
        if (onPostCreated) onPostCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating forum topic.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-lg w-full my-8 flex flex-col overflow-hidden relative">
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-lg text-neutral-900">Create New Discussion Topic</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
              Topic Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Field notes from rural health camp..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
              Category Tag
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans cursor-pointer"
            >
              <option value="Field Notes">Field Notes</option>
              <option value="Policy Questions">Policy Questions</option>
              <option value="Announcements">Announcements</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 mb-1.5">
              Message Body
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share field observations, ask policy questions, or leave encouragement..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
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
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer border-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Topic'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTopicModal;
