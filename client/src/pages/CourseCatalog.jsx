import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  ArrowRight,
  X,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const CourseCatalogModal = ({ isOpen, onClose, moduleToEdit, courseId, onSaveSuccess }) => {
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Orientation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(moduleToEdit);

  useEffect(() => {
    if (moduleToEdit) {
      setNumber(moduleToEdit.number || '');
      setType(moduleToEdit.type || 'Orientation');
      setTitle(moduleToEdit.title || '');
      setDescription(moduleToEdit.description || '');
      setFullContent(moduleToEdit.fullContent || '');
      setDurationMinutes(moduleToEdit.durationMinutes || 15);
      setYoutubeUrl(moduleToEdit.youtubeUrl || '');
      setKeyTakeawaysText(
        Array.isArray(moduleToEdit.keyTakeaways)
          ? moduleToEdit.keyTakeaways.join('\n')
          : ''
      );
    } else {
      setNumber('');
      setType('Orientation');
      setTitle('');
      setDescription('');
      setFullContent('');
      setDurationMinutes(15);
      setYoutubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
      setKeyTakeawaysText('');
    }
  }, [moduleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide module title and description.');
      return;
    }

    const keyTakeaways = keyTakeawaysText
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        number,
        type,
        title,
        description,
        fullContent: fullContent || `### ${title}\n\nDetailed study content and operational field guidelines.`,
        durationMinutes: Number(durationMinutes) || 15,
        youtubeUrl: youtubeUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        keyTakeaways
      };

      let res;
      if (isEditing) {
        res = await api.put(`/courses/modules/${moduleToEdit._id}`, payload);
      } else {
        res = await api.post(`/courses/${courseId}/modules`, payload);
      }

      if (res.data && res.data.success) {
        onSaveSuccess();
        onClose();
      }
    } catch (err) {
      console.error('[ModuleModal] Save error:', err);
      setError(err.response?.data?.message || 'Failed to save module.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 w-full max-w-xl p-6 space-y-6 shadow-xl my-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h3 className="text-lg font-bold font-heading text-neutral-900">
            {isEditing ? 'Edit Program Module' : 'Add New Program Module'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-sans border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
                Module Number (e.g. 01)
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
                Category / Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Orientation, Safety, Ethics"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Non-Profit Work"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans font-bold outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
              Brief Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of module goals..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
                YouTube Embed URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
              Key Takeaways (one per line)
            </label>
            <textarea
              rows={3}
              value={keyTakeawaysText}
              onChange={(e) => setKeyTakeawaysText(e.target.value)}
              placeholder="Key point 1&#10;Key point 2"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-neutral-600 mb-1">
              Full Lesson Content & Field Notes
            </label>
            <textarea
              rows={4}
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              placeholder="Enter multi-paragraph study notes, operational guidelines, and protocols..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-sans outline-none focus:border-emerald-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="quiet" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting} className="gap-2">
              <Plus className="w-4 h-4" /> {submitting ? 'Saving...' : isEditing ? 'Update Module' : 'Create Module'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CourseCatalog = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetting, setResetting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState(null);

  const isPrivileged = user && (user.role === 'admin' || user.role === 'trainer');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        api.get('/courses'),
        api.get('/progress')
      ]);

      if (courseRes.data && courseRes.data.success) {
        setCourses(courseRes.data.data);
      }

      if (progressRes.data && progressRes.data.success && progressRes.data.data.length > 0) {
        setUserProgress(progressRes.data.data[0]);
      } else {
        setUserProgress({ completedModules: [] });
      }
    } catch (err) {
      console.error('[CourseCatalog] Error fetching courses:', err);
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.key]);

  const handleResetProgress = async () => {
    if (!window.confirm('Reset all your module progress to 0% for testing?')) return;
    try {
      setResetting(true);
      const res = await api.post('/progress/reset');
      if (res.data && res.data.success) {
        setUserProgress({ completedModules: [] });
        fetchData();
      }
    } catch (err) {
      console.error('[CourseCatalog] Error resetting progress:', err);
      alert('Failed to reset progress.');
    } finally {
      setResetting(false);
    }
  };

  const activeCourse = courses.length > 0 ? courses[0] : null;
  const modulesList = activeCourse && activeCourse.modules ? activeCourse.modules : [];

  // Helper function to safely check if a module is completed
  const isModuleCompleted = (moduleId) => {
    if (!userProgress || !userProgress.completedModules) return false;
    return userProgress.completedModules.some((item) => {
      const id = typeof item === 'object' && item !== null ? item._id : item;
      return String(id) === String(moduleId);
    });
  };

  const completedCount = modulesList.filter(mod => isModuleCompleted(mod._id)).length;
  const totalModulesCount = modulesList.length;
  const progressPercent = totalModulesCount > 0 ? Math.round((completedCount / totalModulesCount) * 100) : 0;

  // Logic: Find first uncompleted module for In Progress status
  const nextUncompletedModule = modulesList.find(m => !isModuleCompleted(m._id));

  const handleOpenAddModal = () => {
    setModuleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, mod) => {
    e.stopPropagation();
    setModuleToEdit(mod);
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (e, moduleId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      const res = await api.delete(`/courses/modules/${moduleId}`);
      if (res.data && res.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('[CourseCatalog] Error deleting module:', err);
      alert(err.response?.data?.message || 'Failed to delete module.');
    }
  };

  return (
    <div className="space-y-8 bg-[#F5F1E8] min-h-screen text-[#24302B]">
      {/* Course Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full uppercase tracking-wider inline-block">
              Orientation Curriculum
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 mt-3">
              {activeCourse ? activeCourse.title : 'NGO Volunteer Orientation & Field Readiness Program'}
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-1 font-sans max-w-3xl leading-relaxed">
              {activeCourse ? activeCourse.description : 'Equip yourself with core humanitarian values, safeguarding policies, field safety protocols, and emergency response skills.'}
            </p>
          </div>

          {progressPercent > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetProgress}
                disabled={resetting}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 border-0 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resetting ? 'Resetting...' : 'Reset Progress (0%)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Course Progress Summary Bar */}
        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-neutral-100">
          <span className="text-neutral-500 font-medium">
            OVERALL PROGRESS: <strong className="text-emerald-700">{completedCount} / {totalModulesCount} MODULES ({progressPercent}%)</strong>
          </span>
          <span className="text-amber-700 font-bold">
            {progressPercent === 100 ? '✓ CERTIFICATE UNLOCKED' : `${totalModulesCount - completedCount} REMAINING`}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Module List Section Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> 
            Program Modules ({totalModulesCount})
          </h2>

          {/* Privilege Add Module Button */}
          {isPrivileged && activeCourse && (
            <button
              onClick={handleOpenAddModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Module
            </button>
          )}
        </div>

        {loading ? (
          /* Animated CSS Skeleton Pulse Loaders */
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white p-5 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl skeleton-pulse shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-24 h-4 rounded skeleton-pulse"></div>
                    <div className="w-3/4 h-5 rounded skeleton-pulse"></div>
                  </div>
                </div>
                <div className="w-20 h-8 rounded-xl skeleton-pulse shrink-0"></div>
              </div>
            ))}
          </div>
        ) : modulesList.length > 0 ? (
          <div className="space-y-3">
            {modulesList.map((mod, idx) => {
              const completed = isModuleCompleted(mod._id);
              const isNextUp = !completed && nextUncompletedModule && (nextUncompletedModule._id === mod._id);

              return (
                <div
                  key={mod._id || idx}
                  onClick={() => navigate(`/module/${mod._id}`)}
                  className={`bg-white border border-neutral-200/80 hover:border-emerald-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                    completed ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    {/* Consolidated Step Badge */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-base flex items-center justify-center shrink-0 border border-emerald-100/60 font-mono">
                      {mod.number || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Pill */}
                        <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 font-medium text-xs rounded-md uppercase">
                          {mod.type || 'Orientation'}
                        </span>

                        {/* Duration Pill */}
                        <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {mod.durationMinutes || 15} MINS
                        </span>

                        {/* Status Pill */}
                        {completed ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Completed
                          </span>
                        ) : isNextUp ? (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            In Progress
                          </span>
                        ) : (
                          <span className="bg-neutral-100 text-neutral-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Not Started
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold font-heading text-neutral-900">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-neutral-500 font-sans line-clamp-1">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Admin Action Separation (Edit / Delete) */}
                    {isPrivileged && (
                      <div className="flex items-center gap-1 mr-2 border-r border-neutral-200 pr-3">
                        <button
                          onClick={(e) => handleOpenEditModal(e, mod)}
                          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                          title="Edit Module"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteModule(e, mod._id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Primary Action Button (CTA) */}
                    {completed ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/module/${mod._id}`);
                        }}
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <span>Review Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/module/${mod._id}`);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-xs border-0 cursor-pointer"
                      >
                        <span>{isNextUp ? 'Continue' : 'Start Module'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 text-center space-y-3 shadow-xs">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold font-heading text-neutral-900">No orientation modules available yet.</h3>
            <p className="text-xs text-neutral-500">New learning modules will appear here once published by trainers.</p>
          </div>
        )}
      </div>

      {/* Modal for Adding/Editing Module */}
      <CourseCatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        moduleToEdit={moduleToEdit}
        courseId={activeCourse ? activeCourse._id : '66b4e1a2f9a1b2c3d4e5f701'}
        onSaveSuccess={fetchData}
      />
    </div>
  );
};

export default CourseCatalog;
