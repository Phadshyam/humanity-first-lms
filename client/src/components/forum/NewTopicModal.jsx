import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24302B]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF7] rounded-2xl border border-[#D4CEC0] max-w-lg w-full shadow-xl overflow-hidden my-8">
        <div className="bg-[#F5F1E8] px-6 py-4 border-b border-[#D4CEC0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#176B4D]" />
            <h3 className="font-extrabold font-heading text-lg text-[#24302B]">Create New Discussion Topic</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#5C665F] hover:text-[#24302B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#F0D4C3] text-[#C96B3C] text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Topic Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Field notes from rural health camp..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-sm focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Category Tag
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-sm focus:outline-none focus:ring-2 focus:ring-[#176B4D] font-sans"
            >
              <option value="Field Notes">Field Notes</option>
              <option value="Policy Questions">Policy Questions</option>
              <option value="Announcements">Announcements</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Message Body
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share field observations, ask policy questions, or leave encouragement..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-sm focus:outline-none focus:ring-2 focus:ring-[#176B4D] font-sans"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="quiet" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting} className="gap-2">
              <Send className="w-4 h-4" /> {submitting ? 'Publishing...' : 'Publish Topic'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTopicModal;
