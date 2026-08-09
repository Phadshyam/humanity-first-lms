import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Clock } from 'lucide-react';
import api from '../../services/api';
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
    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-heading text-neutral-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" /> Course modules
        </h3>

        {course && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 border-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Module
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {modules.length > 0 ? (
          modules.map((mod, idx) => (
            <div
              key={mod._id || idx}
              className="bg-white border border-neutral-200/80 hover:border-emerald-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                  {mod.number || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold font-heading text-neutral-900 truncate text-sm">{mod.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-medium text-neutral-600 border border-neutral-200 uppercase shrink-0">
                      {mod.type || 'Orientation'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 font-sans mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> {mod.durationMinutes || 15} mins
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteModule(mod._id)}
                disabled={deletingId === mod._id}
                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent shrink-0"
                title="Delete Module"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200/80">
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
