import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, CheckCircle2, Clock, WifiOff, Zap, Edit3 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import QuizModal from '../components/learner/QuizModal';
import QuizEditorModal from '../components/admin/QuizEditorModal';
import { useBandwidth } from '../context/BandwidthContext';
import { useAuth } from '../context/AuthContext';

// Clean Lightweight Markdown Content Renderer
const parseInlineFormatting = (text) => {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderFormattedContent = (content) => {
  if (!content) {
    return <p className="italic text-neutral-500">Detailed study material available for field deployment readiness.</p>;
  }

  const blocks = content.split(/\n\n+/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-lg font-bold text-neutral-900 mt-4 mb-2">
          {parseInlineFormatting(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-xl font-bold text-neutral-900 mt-5 mb-2">
          {parseInlineFormatting(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="text-2xl font-bold text-neutral-900 mt-6 mb-3">
          {parseInlineFormatting(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
    }

    const lines = trimmed.split('\n');
    if (lines.every(line => /^\s*[-*]\s+/.test(line))) {
      return (
        <ul key={idx} className="list-disc list-inside space-y-1.5 my-3 text-neutral-700">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>
              {parseInlineFormatting(line.replace(/^\s*[-*]\s+/, ''))}
            </li>
          ))}
        </ul>
      );
    }

    if (lines.every(line => /^\s*\d+\.\s+/.test(line))) {
      return (
        <ol key={idx} className="list-decimal list-inside space-y-1.5 my-3 text-neutral-700">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>
              {parseInlineFormatting(line.replace(/^\s*\d+\.\s+/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={idx} className="text-neutral-700 leading-relaxed my-2">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });
};

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

  const getEmbedUrl = (url) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/embed/')) return url;
    
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
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold font-heading text-emerald-700">Loading Video Workspace...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-neutral-200 text-center space-y-4">
        <p className="text-red-600 text-sm font-semibold">{error || 'Module not found.'}</p>
        <Button variant="outline" onClick={() => navigate('/course')}>
          Back to Course Outline
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Breadcrumb Link */}
      <Link
        to="/course"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-emerald-700 transition-colors mb-4 no-underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Program Outline
      </Link>

      {/* Video Workspace Container 16:9 Ratio OR Low Bandwidth Data Saver Fallback */}
      {isLowBandwidth ? (
        <div className="w-full aspect-video rounded-2xl border border-neutral-200/80 bg-neutral-50 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xs mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
            <WifiOff className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md">
            <span className="px-3 py-1 rounded-full bg-amber-700 text-white text-xs font-mono font-bold uppercase tracking-wider">
              ⚡ DATA SAVER ACTIVE
            </span>
            <h3 className="text-lg font-extrabold font-heading text-neutral-900">
              Video Streaming Disabled
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Video streaming is disabled to save bandwidth on field networks. Please use the Study Material and Key Takeaways below.
            </p>
          </div>

          <button
            onClick={toggleLowBandwidth}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-700 border border-neutral-200 text-xs font-semibold hover:bg-emerald-50 transition shadow-2xs cursor-pointer"
          >
            <Zap className="w-4 h-4" /> Turn Off Data Saver
          </button>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-xs mb-8 relative">
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
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider">
                Module {module.number || '01'}
              </span>
              <span className="px-3 py-1 bg-neutral-100 text-neutral-700 font-semibold text-xs rounded-lg uppercase">
                {module.type || 'Orientation'}
              </span>
              {isCompleted && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold font-heading text-neutral-900 pt-1">
              {module.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400" /> {module.durationMinutes || 15} minutes
            </span>
          </div>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed font-sans">
          {module.description}
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setIsQuizOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-xs flex items-center gap-2 border-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Knowledge Check Quiz</span>
          </button>

          {/* Admin / Trainer Quiz Editor Button */}
          {isPrivileged && (
            <button
              onClick={() => setIsQuizEditorOpen(true)}
              className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Quiz Questions</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabbed Section Below Video */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/50">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-3 text-sm font-semibold transition cursor-pointer border-t-0 border-x-0 ${
              activeTab === 'study' 
                ? 'border-b-2 border-emerald-700 text-emerald-800 bg-white font-semibold' 
                : 'text-neutral-500 hover:text-neutral-800 font-medium border-b-2 border-transparent'
            }`}
          >
            Detailed Study Material & Field Notes
          </button>

          <button
            onClick={() => setActiveTab('takeaways')}
            className={`px-4 py-3 text-sm font-semibold transition cursor-pointer border-t-0 border-x-0 ${
              activeTab === 'takeaways' 
                ? 'border-b-2 border-emerald-700 text-emerald-800 bg-white font-semibold' 
                : 'text-neutral-500 hover:text-neutral-800 font-medium border-b-2 border-transparent'
            }`}
          >
            Key Takeaways
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'study' && (
            <div className="space-y-4 font-sans">
              {/* Field Manual Header Box */}
              <div className="bg-emerald-50/60 border-l-4 border-emerald-600 p-4 rounded-r-xl mb-6">
                <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                  Field Reading Manual
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                  {module.title}
                </h4>
              </div>

              <div className="prose prose-emerald max-w-none text-neutral-800 leading-relaxed space-y-4">
                {renderFormattedContent(module.fullContent)}
              </div>
            </div>
          )}

          {activeTab === 'takeaways' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-heading text-neutral-900">Core Summary & Field Principles:</h3>
              {module.keyTakeaways && module.keyTakeaways.length > 0 ? (
                <ul className="space-y-2 text-xs md:text-sm text-neutral-700 font-sans">
                  {module.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 italic">No key takeaways logged for this module.</p>
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
