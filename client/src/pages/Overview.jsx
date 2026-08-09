import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Quote,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/common/MetricCard';
import api from '../services/api';

const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const [courseRes, progressRes] = await Promise.all([
          api.get('/courses'),
          api.get('/progress')
        ]);

        if (courseRes.data && courseRes.data.success && courseRes.data.data.length > 0) {
          setCourse(courseRes.data.data[0]);
        }

        if (progressRes.data && progressRes.data.success && progressRes.data.data.length > 0) {
          setProgressData(progressRes.data.data[0]);
        }
      } catch (err) {
        console.error('[Overview] Error fetching live dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Compute Real-Time Metrics
  const courseModules = course && course.modules ? course.modules : [];
  const totalModulesCount = courseModules.length || 8;
  
  const completedModuleIds = progressData && progressData.completedModules
    ? progressData.completedModules.map(m => String(typeof m === 'object' && m !== null ? (m._id || m) : m))
    : [];
  
  const completedCount = Math.min(completedModuleIds.length, totalModulesCount);
  const progressPercent = totalModulesCount > 0 ? Math.min(100, Math.round((completedCount / totalModulesCount) * 100)) : 0;
  const quizAttemptsCount = progressData && progressData.quizAttempts ? progressData.quizAttempts.length : 0;
  const isCertificateUnlocked = progressData ? progressData.certificateIssued : false;

  // Logic: Find first uncompleted module
  const nextUncompletedModule = courseModules.find(m => !completedModuleIds.includes(String(m._id || m)));

  const handleContinueLearning = () => {
    if (nextUncompletedModule && nextUncompletedModule._id) {
      navigate(`/module/${nextUncompletedModule._id}`);
    } else {
      navigate('/course');
    }
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[#24302B]">
            Welcome back, {user?.name || 'Volunteer'} 👋
          </h1>
          <p className="text-sm text-neutral-500 font-medium mt-1 font-sans">
            {todayDateStr} • Humanity First Field Readiness Hub
          </p>
        </div>
      </div>

      {/* Hero Spotlight Card (Refined Dark Green #0F4C3A) */}
      <div className="bg-[#0F4C3A] text-[#FFFDF7] rounded-2xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF7]/20 text-[#FFFDF7] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> FEATURED ORIENTATION PROGRAM
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-heading leading-tight">
            {course ? course.title : 'NGO Volunteer Orientation Program'}
          </h2>

          <p className="text-xs md:text-sm text-[#FFFDF7]/85 leading-relaxed font-sans">
            {course ? course.description : 'Equip yourself with core humanitarian values, child protection codes of conduct, field safety guidelines, and basic first aid protocols before deployment.'}
          </p>

          <div className="pt-2">
            <button
              onClick={handleContinueLearning}
              className="bg-white hover:bg-neutral-100 text-[#0F4C3A] font-bold py-3 px-5 rounded-xl transition-colors gap-2 shadow-xs border-0 cursor-pointer flex items-center text-xs md:text-sm"
            >
              <span>{progressPercent > 0 ? 'Continue Learning' : 'Start Program'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular SVG Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0 z-10">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="12"
              className="text-[#FFFDF7]/20"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progressPercent) / 100}
              className="text-[#FFFDF7] transition-all duration-1000 ease-out"
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-heading text-[#FFFDF7]">{progressPercent}%</span>
            <span className="text-[10px] font-mono uppercase text-[#FFFDF7]/80 font-bold">Completed</span>
          </div>
        </div>
      </div>

      {/* Interactive Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clickable Modules Card */}
        <div onClick={() => navigate('/course')}>
          <MetricCard
            title="MODULES COMPLETED"
            value={`${completedCount} / ${totalModulesCount}`}
            subtext={`${totalModulesCount - completedCount} remaining to finish`}
            icon={BookOpen}
            iconBgClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Clickable Progress Card */}
        <div onClick={() => navigate('/course')}>
          <MetricCard
            title="OVERALL PROGRESS"
            value={`${progressPercent}%`}
            subtext="Updated in real time"
            highlight={progressPercent > 0}
            icon={CheckCircle2}
            iconBgClass="bg-sky-50 text-sky-600"
          />
        </div>

        {/* Quiz Attempts Card */}
        <MetricCard
          title="QUIZ ATTEMPTS"
          value={`${quizAttemptsCount}`}
          subtext="Knowledge check logs"
          icon={HelpCircle}
          iconBgClass="bg-amber-50 text-amber-600"
        />

        {/* Clickable Certificate Card */}
        <div onClick={() => navigate('/certificate')}>
          <MetricCard
            title="CERTIFICATE STATUS"
            value={isCertificateUnlocked ? 'UNLOCKED' : 'IN PROGRESS'}
            subtext={isCertificateUnlocked ? 'Verified credential available' : 'Complete 100% to claim'}
            highlight={isCertificateUnlocked}
            icon={Award}
            iconBgClass="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      {/* Bottom Grid: Field Philosophy & Certificate Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Field Guide Quote Card */}
        <div className="md:col-span-2 border-l-4 border-emerald-600 bg-white shadow-sm rounded-r-xl p-6 space-y-3 relative">
          <Quote className="w-8 h-8 text-emerald-600/20 absolute top-4 right-4" />
          <h3 className="text-base font-extrabold font-heading text-[#24302B] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Humanitarian Operational Philosophy
          </h3>
          <blockquote className="italic text-neutral-700 leading-relaxed font-sans text-xs md:text-sm">
            "Service to humanity requires not just empathy, but rigorous field readiness, dignity in interaction, and absolute adherence to safety codes."
          </blockquote>
          <p className="text-xs font-mono font-bold text-emerald-700">— Humanity First Training Charter 2026</p>
        </div>

        {/* Certificate Action Box */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm font-heading mb-1">
              <Award className="w-5 h-5" /> Earn Certificate
            </div>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              Pass each module quiz with 80%+ to issue your cryptographic verification credential.
            </p>
          </div>

          <button
            onClick={() => navigate('/certificate')}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between w-full border-0 cursor-pointer text-xs"
          >
            <span>{isCertificateUnlocked ? 'View Certificate' : 'Check Eligibility'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
