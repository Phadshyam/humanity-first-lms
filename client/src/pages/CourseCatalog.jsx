import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

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
    <div className="fixed inset-0 z-50 bg-[#24302B]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFDF7] rounded-2xl border border-[#D4CEC0] w-full max-w-xl p-6 space-y-6 shadow-xl my-8">
        <div className="flex items-center justify-between border-b border-[#D4CEC0] pb-4">
          <h3 className="text-lg font-bold font-heading text-[#24302B]">
            {isEditing ? 'Edit Program Module' : 'Add New Program Module'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5C665F] hover:bg-[#F5F1E8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#F5D8D5] text-[#A94442] text-xs font-sans border border-[#E8B4B0]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                Module Number (e.g. 01)
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                Category / Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Orientation, Safety, Ethics"
                className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Non-Profit Work"
              className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Brief Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of module goals..."
              className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
                YouTube Embed URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Key Takeaways (one per line)
            </label>
            <textarea
              rows={3}
              value={keyTakeawaysText}
              onChange={(e) => setKeyTakeawaysText(e.target.value)}
              placeholder="Key point 1&#10;Key point 2"
              className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase text-[#5C665F] mb-1">
              Full Lesson Content & Field Notes
            </label>
            <textarea
              rows={4}
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              placeholder="Enter multi-paragraph study notes, operational guidelines, and protocols..."
              className="w-full px-3 py-2 rounded-xl border border-[#D4CEC0] bg-[#F5F1E8] text-[#24302B] text-xs font-sans"
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
      <div className="bg-[#FFFDF7] p-6 md:p-8 rounded-2xl border border-[#D4CEC0] space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-extrabold text-[#C96B3C] uppercase tracking-wider">
              ORIENTATION CURRICULUM
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[#24302B] mt-0.5">
              {activeCourse ? activeCourse.title : 'NGO Volunteer Orientation & Field Readiness Program'}
            </h1>
            <p className="text-xs md:text-sm text-[#5C665F] mt-1 font-sans max-w-3xl">
              {activeCourse ? activeCourse.description : 'Equip yourself with core humanitarian values, safeguarding policies, field safety protocols, and emergency response skills.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="quiet"
              size="sm"
              onClick={handleResetProgress}
              disabled={resetting}
              className="gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {resetting ? 'Resetting...' : 'Reset Progress (0%)'}
            </Button>
          </div>
        </div>

        {/* Course Progress Summary Bar */}
        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#D4CEC0]">
          <span className="text-[#5C665F]">
            OVERALL PROGRESS: <strong className="text-[#176B4D]">{completedCount} / {totalModulesCount} MODULES ({progressPercent}%)</strong>
          </span>
          <span className="text-[#C96B3C] font-bold">
            {progressPercent === 100 ? '✓ CERTIFICATE UNLOCKED' : `${totalModulesCount - completedCount} REMAINING`}
          </span>
        </div>

        <div className="w-full bg-[#E9E4D8] h-3 rounded-full overflow-hidden">
          <div 
            className="bg-[#176B4D] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Module List Section Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-[#24302B] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#176B4D]" /> 
            Program Modules ({totalModulesCount})
          </h2>

          {/* Privilege Add Module Button */}
          {isPrivileged && activeCourse && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              className="gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Module
            </Button>
          )}
        </div>

        {loading ? (
          /* Animated CSS Skeleton Pulse Loaders */
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-[#FFFDF7] p-5 rounded-2xl border border-[#D4CEC0] flex items-center justify-between gap-4">
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

              return (
                <div
                  key={mod._id || idx}
                  onClick={() => navigate(`/module/${mod._id}`)}
                  className={`bg-[#FFFDF7] p-5 rounded-2xl border transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-[#176B4D] hover:shadow-md ${
                    completed ? 'border-[#176B4D]/40 bg-[#D8E8DD]/20' : 'border-[#D4CEC0]'
                  }`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    {/* Terracotta Number Badge */}
                    <div className="w-12 h-12 rounded-xl bg-[#F0D4C3] text-[#C96B3C] font-mono font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#C96B3C]/20">
                      {mod.number || `0${idx + 1}`}
                    </div>

                    {/* Dynamic Row Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      completed ? 'bg-[#D8E8DD] text-[#176B4D]' : 'bg-[#E9E4D8] text-[#5C665F]'
                    }`}>
                      {completed ? <CheckCircle2 className="w-5 h-5 text-[#176B4D]" /> : <BookOpen className="w-5 h-5 text-[#5C665F]" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-extrabold text-[#C96B3C] bg-[#E9E4D8] px-2 py-0.5 rounded uppercase">
                          {mod.type || 'Orientation'}
                        </span>
                        {completed && (
                          <span className="text-[10px] font-mono font-bold text-[#176B4D] bg-[#D8E8DD] px-2 py-0.5 rounded">
                            ✓ Completed
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#5C665F]">
                          {mod.durationMinutes || 15} MINS
                        </span>
                      </div>

                      <h3 className="text-base font-bold font-heading text-[#24302B]">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[#5C665F] font-sans line-clamp-1">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Trainer / Admin Edit & Delete Privilege Buttons */}
                    {isPrivileged && (
                      <div className="flex items-center gap-1 mr-2 border-r border-[#D4CEC0] pr-3">
                        <button
                          onClick={(e) => handleOpenEditModal(e, mod)}
                          className="p-2 rounded-lg text-[#5C665F] hover:bg-[#E9E4D8] hover:text-[#176B4D] transition"
                          title="Edit Module"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteModule(e, mod._id)}
                          className="p-2 rounded-lg text-[#5C665F] hover:bg-[#F5D8D5] hover:text-[#A94442] transition"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <Button
                      variant={completed ? 'outline' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/module/${mod._id}`);
                      }}
                      className="gap-1.5"
                    >
                      {completed ? 'Review Module' : 'Start Module'} <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#FFFDF7] p-8 rounded-2xl border border-[#D4CEC0] text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#5C665F] mx-auto" />
            <h3 className="text-base font-bold font-heading text-[#24302B]">No orientation modules available yet.</h3>
            <p className="text-xs text-[#5C665F]">New learning modules will appear here once published by trainers.</p>
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
