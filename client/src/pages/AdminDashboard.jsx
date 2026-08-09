import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Users, Activity, Award, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';
import ContentManager from '../components/admin/ContentManager';
import QuizPerformance from '../components/admin/QuizPerformance';
import UserDirectory from '../components/admin/UserDirectory';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, courseRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/courses')
      ]);

      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (usersRes.data && usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

      if (courseRes.data && courseRes.data.success && courseRes.data.data.length > 0) {
        setCourse(courseRes.data.data[0]);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [location.key]);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'NGO_LMS_Learner_Report_2026.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('[AdminDashboard] Error exporting CSV:', err);
      alert('Failed to export CSV report.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-40 h-4 rounded skeleton-pulse"></div>
            <div className="w-64 h-8 rounded skeleton-pulse"></div>
          </div>
          <div className="w-32 h-10 rounded-xl skeleton-pulse"></div>
        </div>

        {/* KPI Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] h-32 flex flex-col justify-between">
              <div className="w-24 h-4 rounded skeleton-pulse"></div>
              <div className="w-16 h-8 rounded skeleton-pulse"></div>
              <div className="w-36 h-3 rounded skeleton-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalUsersCount = stats ? stats.totalUsers : 0;
  const activeLearnersCount = stats ? stats.activeLearners : 0;
  const completedLearnersCount = stats ? (stats.completedLearners !== undefined ? stats.completedLearners : 0) : 0;
  const completionRatePercent = stats ? (stats.completionRate !== undefined ? stats.completionRate : (stats.completionRatePercent || 0)) : 0;
  const averageScorePercent = stats ? (stats.averageScore !== undefined ? stats.averageScore : (stats.networkAverageScorePercent || 0)) : 0;
  const totalCertificatesCount = stats ? (stats.totalCertificates !== undefined ? stats.totalCertificates : (stats.certificatesIssued || 0)) : 0;
  const moduleStatsList = stats ? (stats.moduleStats || stats.perModulePerformance || []) : [];

  return (
    <div className="space-y-8 bg-[#F5F1E8] min-h-screen text-[#24302B]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-extrabold text-[#C96B3C] uppercase tracking-wider">
            ADMINISTRATION / REPORTS
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[#24302B] mt-0.5">
            People & progress.
          </h1>
          <p className="text-xs md:text-sm text-[#5C665F] mt-1 font-sans">
            Manage learning content and understand how the network is moving.
          </p>
        </div>

        <Button variant="primary" onClick={handleExportCSV} className="gap-2 shrink-0 shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Top KPI Stats Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL USERS"
          value={totalUsersCount}
          subtext="Registered network members"
          icon={Users}
        />

        <MetricCard
          title="ACTIVE LEARNERS"
          value={activeLearnersCount}
          subtext="Started at least one quiz"
          highlight={activeLearnersCount > 0}
          icon={Activity}
        />

        <MetricCard
          title="COMPLETION RATE"
          value={`${completionRatePercent}%`}
          subtext={`${completedLearnersCount} completed learners`}
          icon={CheckCircle2}
        />

        <MetricCard
          title="AVG QUIZ SCORE"
          value={`${averageScorePercent}%`}
          subtext={`${totalCertificatesCount} certificates issued`}
          highlight={averageScorePercent >= 80}
          icon={Award}
        />
      </div>

      {/* Two-Column Split Layout for Content Manager & Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentManager course={course} onCourseUpdated={fetchAdminData} />
        <QuizPerformance moduleStats={moduleStatsList} />
      </div>

      {/* Full-Width People Directory */}
      <UserDirectory users={users} />
    </div>
  );
};

export default AdminDashboard;
