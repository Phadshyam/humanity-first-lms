import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Printer, Lock, CheckCircle2, ShieldCheck, GraduationCap, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

const CertificateView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progressRes, courseRes] = await Promise.all([
          api.get('/progress'),
          api.get('/courses')
        ]);

        if (progressRes.data && progressRes.data.success && progressRes.data.data.length > 0) {
          setProgress(progressRes.data.data[0]);
        }

        if (courseRes.data && courseRes.data.success) {
          setCourses(courseRes.data.data);
        }
      } catch (err) {
        console.error('[CertificateView] Error fetching certificate details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCourse = courses.length > 0 ? courses[0] : null;
  const totalModulesCount = activeCourse && activeCourse.modules ? activeCourse.modules.length : 8;

  const completedModulesList = progress ? progress.completedModules || [] : [];
  const completedModulesCount = completedModulesList.length;
  const progressPercent = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;

  // Unlock Condition Logic
  const isUnlocked = progress
    ? progress.certificateIssued || (completedModulesCount > 0 && completedModulesCount >= totalModulesCount)
    : false;

  const certId = progress && progress.certificateId ? progress.certificateId : 'CERT-HF-2026-X8K9';
  
  const issuedDate = progress && progress.issuedAt 
    ? new Date(progress.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const verificationUrl = `${window.location.origin}/verify/${certId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setToastMessage('Verification link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#176B4D] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold font-heading text-[#176B4D]">Checking Certificate Eligibility...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#24302B]">
      {/* Top Header Banner (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[#24302B] flex items-center gap-2">
            <Award className="w-7 h-7 text-[#176B4D]" /> Official Verified Certificate
          </h1>
          <p className="text-xs md:text-sm text-[#5C665F] mt-1 font-sans">
            Verified humanitarian credential issued by Humanity First NGO Learning Hub
          </p>
        </div>

        {/* Action Toolbar */}
        {isUnlocked && (
          <div className="flex items-center gap-3 shrink-0 no-print">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-[#176B4D]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Copy Verification Link'}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              className="gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Download PDF
            </Button>
          </div>
        )}
      </div>

      {isUnlocked ? (
        /* Professional Certificate Paper Layout */
        <div className="certificate-paper relative p-8 md:p-12 rounded-2xl border-[8px] border-double border-[#176B4D] bg-[#FFFDF7] shadow-xl space-y-6 max-w-[850px] min-h-[580px] mx-auto my-4 overflow-hidden">
          {/* Inner Inset Diploma Border Frame */}
          <div className="absolute inset-6 border border-[#176B4D]/30 pointer-events-none rounded-xl"></div>

          {/* Header Mark & Brand Label */}
          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div className="w-12 h-12 rounded-full bg-[#176B4D] text-[#FFFDF7] font-mono font-extrabold text-xl flex items-center justify-center mx-auto shadow-xs">
              ⌁
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#5C665F] uppercase">
              HUMANITY FIRST NGO LEARNING HUB
            </span>
          </div>

          {/* Main Title & Award Statement */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-[#176B4D] tracking-tight">
              CERTIFICATE OF COMPLETION
            </h2>

            <p className="text-xs font-mono text-[#5C665F] uppercase tracking-widest">
              THIS IS TO OFFICIALLY CERTIFY THAT
            </p>

            {/* Recipient Name with Terracotta Underline */}
            <div className="text-2xl md:text-4xl font-extrabold font-heading text-[#C96B3C] border-b-2 border-[#C96B3C]/40 pb-1 px-8 inline-block">
              {user?.name || 'Field Learner'}
            </div>

            <p className="text-xs md:text-sm font-sans text-[#5C665F] leading-relaxed max-w-xl mx-auto pt-1">
              has successfully completed all required modules, field safety protocols, and knowledge check evaluations for the
            </p>

            {/* Course Title */}
            <h3 className="text-lg md:text-xl font-bold font-heading text-[#24302B]">
              {activeCourse ? activeCourse.title : 'NGO Volunteer Orientation & Field Readiness Program'}
            </h3>
          </div>

          {/* Footer Block: Left Meta, Middle Signatures, Right Verification Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#D4CEC0] items-end text-center md:text-left font-sans">
            {/* Left Column: Date & Credential ID */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#5C665F] uppercase block font-bold">Issue Date</span>
              <span className="text-xs font-bold font-heading text-[#24302B] block">{issuedDate}</span>
              <span className="text-[10px] font-mono text-[#5C665F] uppercase block font-bold pt-1">Credential ID</span>
              <span className="text-xs font-mono font-extrabold text-[#C96B3C] bg-[#F0D4C3]/40 px-2 py-0.5 rounded inline-block">
                {certId}
              </span>
            </div>

            {/* Middle Column: Dual Signatures */}
            <div className="text-center space-y-3">
              <div>
                <div className="w-32 h-0.5 bg-[#24302B]/30 mx-auto mb-1"></div>
                <span className="text-xs font-bold font-heading text-[#24302B] block">Shyam Phad</span>
                <span className="text-[10px] font-mono text-[#5C665F] uppercase block">Director of Training</span>
              </div>
              <div>
                <div className="w-32 h-0.5 bg-[#24302B]/30 mx-auto mb-1"></div>
                <span className="text-[10px] font-mono font-bold text-[#176B4D] uppercase block">Humanity First Executive Board</span>
              </div>
            </div>

            {/* Right Column: Verification Box */}
            <div className="text-center md:text-right space-y-1">
              <div className="inline-flex items-center gap-1 text-[#176B4D] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">VERIFY CREDENTIAL AT:</span>
              </div>
              <p className="text-[10px] font-mono text-[#176B4D] font-bold underline break-all">
                ngo-learn.org/verify/{certId}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Locked Certificate View */
        <div className="bg-[#FFFDF7] p-8 md:p-12 rounded-3xl border border-[#D4CEC0] text-center space-y-6 max-w-2xl mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F0D4C3] text-[#C96B3C] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold font-heading text-[#24302B]">Certificate Currently Locked</h2>
            <p className="text-sm text-[#5C665F] max-w-md mx-auto font-sans">
              Complete all course modules and pass each knowledge check quiz (80%+ score) to unlock your verified credential.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#D4CEC0] max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>Modules Completed</span>
              <span className="text-[#176B4D]">{completedModulesCount} / {totalModulesCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-[#E9E4D8] h-3 rounded-full overflow-hidden">
              <div className="bg-[#176B4D] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <Button variant="primary" onClick={() => navigate('/course')} className="gap-2">
            <span>Continue Course Outline</span> <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default CertificateView;
