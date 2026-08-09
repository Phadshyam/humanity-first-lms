import React, { useState } from 'react';
import { X, Plus, Video } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';

const AddModuleModal = ({ isOpen, onClose, courseId, onModuleAdded }) => {
  const [number, setNumber] = useState('08');
  const [type, setType] = useState('Practical skills');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide title and description.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/courses/${courseId}/modules`, {
        number,
        type,
        title,
        description,
        durationMinutes: Number(durationMinutes),
        youtubeUrl
      });

      if (res.data && res.data.success) {
        setTitle('');
        setDescription('');
        onModuleAdded(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating new module.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-line-border max-w-lg w-full shadow-xl overflow-hidden">
        <div className="bg-bg-warm px-6 py-4 border-b border-line-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-forest-green" />
            <h3 className="font-extrabold font-heading text-lg text-ink">Add Course Module</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-text hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-terracotta-soft text-terracotta text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
                Module Number
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
                Module Type Tag
              </label>
              <input
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
              Module Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Field Sanitation Protocols"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
              Description
            </label>
            <textarea
              required
              rows={2}
              placeholder="Short summary of lesson objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-heading uppercase text-muted-text mb-1">
                YouTube Embed Link
              </label>
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-border bg-bg-warm text-ink text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="quiet" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting} className="gap-2">
              <Plus className="w-4 h-4" /> {submitting ? 'Creating...' : 'Add Module'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;
