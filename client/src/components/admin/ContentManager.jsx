import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Clock } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';
import AddModuleModal from './AddModuleModal';

const ContentManager = ({ course, onCourseUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      setDeletingId(moduleId);
      const res = await api.delete(`/courses/modules/${moduleId}`);
      if (res.data && res.data.success) {
        if (onCourseUpdated) onCourseUpdated();
      }
    } catch (err) {
      console.error('[ContentManager] Error deleting module:', err);
      alert(err.response?.data?.message || 'Failed to delete module.');
    } finally {
      setDeletingId(null);
    }
  };

  const modules = course && course.modules ? course.modules : [];

  return (
    <div className="bg-surface p-6 rounded-2xl border border-line-border space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold font-heading text-ink flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-forest-green" /> Course modules
        </h3>

        {course && (
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add module
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {modules.length > 0 ? (
          modules.map((mod, idx) => (
            <div
              key={mod._id || idx}
              className="p-3.5 rounded-xl bg-bg-warm border border-line-border flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-alt-bg text-ink font-mono font-bold flex items-center justify-center shrink-0">
                  {mod.number || `0${idx + 1}`}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold font-heading text-ink truncate">{mod.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-surface text-[9px] font-mono font-bold text-muted-text border border-line-border shrink-0">
                      {mod.type || 'Orientation'}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-text flex items-center gap-1 font-mono mt-0.5">
                    <Clock className="w-3 h-3" /> {mod.durationMinutes || 15} mins
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteModule(mod._id)}
                disabled={deletingId === mod._id}
                className="p-1.5 text-muted-text hover:text-terracotta rounded-lg hover:bg-terracotta-soft transition shrink-0"
                title="Delete Module"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-muted-text bg-bg-warm rounded-xl border border-line-border">
            No course modules currently created.
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      {course && (
        <AddModuleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseId={course._id}
          onModuleAdded={() => onCourseUpdated && onCourseUpdated()}
        />
      )}
    </div>
  );
};

export default ContentManager;
