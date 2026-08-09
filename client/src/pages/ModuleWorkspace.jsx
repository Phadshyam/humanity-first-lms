import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, CheckCircle2, Clock, WifiOff, Zap, BookOpen, Edit3, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import QuizModal from '../components/learner/QuizModal';
import QuizEditorModal from '../components/admin/QuizEditorModal';
import { useBandwidth } from '../context/BandwidthContext';
import { useAuth } from '../context/AuthContext';

const ModuleWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLowBandwidth, toggleLowBandwidth } = useBandwidth();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('study'); // 'study' or 'takeaways'
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const isPrivileged = user && (user.role === 'admin' || user.role === 'trainer');

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch direct module item, overall course, and progress data
        const [modRes, courseRes, progressRes] = await Promise.all([
          api.get(`/courses/modules/${id}`).catch(() => null),
          api.get('/courses').catch(() => null),
          api.get('/progress').catch(() => null)
        ]);

        if (modRes && modRes.data && modRes.data.success && modRes.data.data) {
          setModule(modRes.data.data);
        } else if (courseRes && courseRes.data && courseRes.data.success && courseRes.data.data.length > 0) {
          const currentCourse = courseRes.data.data[0];
          setCourse(currentCourse);
          const foundModule = currentCourse.modules.find(m => String(m._id || m) === String(id));
          if (foundModule) {
            setModule(foundModule);
          }
        }

        if (courseRes && courseRes.data && courseRes.data.success && courseRes.data.data.length > 0) {
          setCourse(courseRes.data.data[0]);
        }

        if (progressRes && progressRes.data && progressRes.data.success && progressRes.data.data.length > 0) {
          const completedIds = progressRes.data.data[0].completedModules.map(m => String(typeof m === 'object' && m !== null ? (m._id || m) : m));
          setIsCompleted(completedIds.includes(String(id)));
        }
      } catch (err) {
        console.error('[ModuleWorkspace] Error fetching module details:', err);
        setError('Failed to load module workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [id]);

  // Extract YouTube embed URL helper
  const getEmbedUrl = (url) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/embed/')) return url;
    
    // Parse watch?v= format
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  };

  const handleQuizFinished = (quizData) => {
    if (quizData && quizData.passed) {
      setIsCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold font-heading text-forest-green">Loading Video Workspace...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="p-8 bg-surface rounded-2xl border border-line-border text-center space-y-4">
        <p className="text-terracotta text-sm font-semibold">{error || 'Module not found.'}</p>
        <Button variant="outline" onClick={() => navigate('/course')}>
          Back to Course Outline
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Link */}
      <button
        onClick={() => navigate('/course')}
        className="inline-flex items-center gap-2 text-xs font-bold font-mono text-muted-text hover:text-forest-green transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Outline
      </button>

      {/* Video Workspace Container OR Low Bandwidth Data Saver Fallback */}
      {isLowBandwidth ? (
        <div className="w-full aspect-video rounded-2xl border border-line-border bg-alt-bg p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-terracotta-soft text-terracotta flex items-center justify-center">
            <WifiOff className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md">
            <span className="px-3 py-1 rounded-full bg-terracotta text-surface text-xs font-mono font-bold uppercase tracking-wider">
              ⚡ DATA SAVER ACTIVE
            </span>
            <h3 className="text-lg font-extrabold font-heading text-ink">
              Video Streaming Disabled
            </h3>
            <p className="text-xs text-muted-text leading-relaxed font-sans">
              Video streaming is disabled to save bandwidth on field networks. Please use the Study Material and Key Takeaways below.
            </p>
          </div>

          <button
            onClick={toggleLowBandwidth}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface text-forest-green border border-line-border text-xs font-mono font-bold hover:bg-green-soft transition shadow-2xs"
          >
            <Zap className="w-4 h-4" /> Turn Off Data Saver
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-line-border bg-ink">
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(module.youtubeUrl)}
            title={module.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Lesson Content Header */}
      <div className="bg-surface p-6 rounded-2xl border border-line-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-line-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-forest-green text-surface text-xs font-mono font-bold">
                Module {module.number || '01'}
              </span>
              <span className="px-2 py-0.5 rounded bg-alt-bg text-ink text-xs font-mono font-semibold">
                {module.type || 'Orientation'}
              </span>
              {isCompleted && (
                <span className="px-2 py-0.5 rounded bg-green-soft text-forest-green text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold font-heading text-ink">
              {module.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-muted-text flex items-center gap-1">
              <Clock className="w-4 h-4" /> {module.durationMinutes || 15} minutes
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-text leading-relaxed font-sans">
          {module.description}
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => setIsQuizOpen(true)}
            className="gap-2 shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Knowledge Check Quiz</span>
          </Button>

          {/* Admin / Trainer Quiz Editor Button */}
          {isPrivileged && (
            <Button
              variant="outline"
              onClick={() => setIsQuizEditorOpen(true)}
              className="gap-2 border-terracotta text-terracotta hover:bg-terracotta-soft"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Quiz Questions</span>
            </Button>
          )}

          <Button
            variant="quiet"
            onClick={() => navigate('/course')}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-forest-green" />
            <span>Back to Outline</span>
          </Button>
        </div>
      </div>

      {/* Tabbed Section Below Video */}
      <div className="bg-surface rounded-2xl border border-line-border overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-line-border bg-bg-warm">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-6 py-3 text-xs font-bold font-heading transition ${
              activeTab === 'study' 
                ? 'bg-surface text-forest-green border-b-2 border-forest-green font-extrabold' 
                : 'text-muted-text hover:text-ink'
            }`}
          >
            Detailed Study Material & Field Notes
          </button>

          <button
            onClick={() => setActiveTab('takeaways')}
            className={`px-6 py-3 text-xs font-bold font-heading transition ${
              activeTab === 'takeaways' 
                ? 'bg-surface text-forest-green border-b-2 border-forest-green font-extrabold' 
                : 'text-muted-text hover:text-ink'
            }`}
          >
            Key Takeaways
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'study' && (
            <div className="space-y-4 text-xs md:text-sm text-ink leading-relaxed font-sans whitespace-pre-line">
              <div className="p-4 rounded-xl bg-alt-bg/60 border border-line-border space-y-1">
                <span className="text-xs font-mono font-bold text-forest-green uppercase block">
                  FIELD READING MANUAL
                </span>
                <h4 className="text-sm font-extrabold font-heading text-ink">
                  {module.title}
                </h4>
              </div>

              <div className="prose max-w-none text-muted-text font-sans">
                {module.fullContent ? (
                  module.fullContent
                ) : (
                  <p className="italic text-muted-text">Detailed study material available for field deployment readiness.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'takeaways' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-heading text-ink">Core Summary & Field Principles:</h3>
              {module.keyTakeaways && module.keyTakeaways.length > 0 ? (
                <ul className="space-y-2 text-xs md:text-sm text-muted-text font-sans">
                  {module.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-green mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-text italic">No key takeaways logged for this module.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Learner Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        moduleId={module._id}
        moduleTitle={module.title}
        onQuizCompleted={handleQuizFinished}
      />

      {/* Privileged Quiz Editor Modal */}
      {isPrivileged && (
        <QuizEditorModal
          isOpen={isQuizEditorOpen}
          onClose={() => setIsQuizEditorOpen(false)}
          moduleId={module._id}
          moduleTitle={module.title}
        />
      )}
    </div>
  );
};

export default ModuleWorkspace;
