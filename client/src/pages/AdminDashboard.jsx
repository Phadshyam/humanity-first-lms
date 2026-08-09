import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Users, Activity, Award, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/common/MetricCard';
import ContentManager from '../components/admin/ContentManager';
import QuizPerformance from '../components/admin/QuizPerformance';
import UserDirectory from '../components/admin/UserDirectory';

const AdminDashboard = () => {
  const location = useLocation();
  const { user: currentUser } = useAuth();
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

  const handleAddUser = async (userData) => {
    try {
      const res = await api.post('/admin/users', userData);
      if (res.data && res.data.success) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error adding user:', err);
      throw err;
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data && res.data.success) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating role:', err);
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data && res.data.success) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
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
            <div key={n} className="bg-white p-6 rounded-2xl border border-neutral-200/80 h-32 flex flex-col justify-between">
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
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full uppercase tracking-wider inline-block">
            Administration Panel
          </span>
          <h1 className="text-2xl font-bold text-neutral-900 mt-2">
            People & Progress
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1 font-sans">
            Manage learning content and understand how the network is moving.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-xs flex items-center gap-2 border-0 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Top KPI Stats Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL USERS"
          value={totalUsersCount}
          subtext="Registered network members"
          icon={Users}
          iconBgClass="bg-emerald-50 text-emerald-700"
        />

        <MetricCard
          title="ACTIVE LEARNERS"
          value={activeLearnersCount}
          subtext="Started at least one quiz"
          highlight={activeLearnersCount > 0}
          icon={Activity}
          iconBgClass="bg-sky-50 text-sky-700"
        />

        <MetricCard
          title="COMPLETION RATE"
          value={`${completionRatePercent}%`}
          subtext={`${completedLearnersCount} completed learners`}
          icon={CheckCircle2}
          iconBgClass="bg-amber-50 text-amber-700"
        />

        <MetricCard
          title="AVG QUIZ SCORE"
          value={`${averageScorePercent}%`}
          subtext={`${totalCertificatesCount} certificates issued`}
          highlight={averageScorePercent >= 80}
          icon={Award}
          iconBgClass="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Two-Column Split Layout for Content Manager & Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentManager course={course} onCourseUpdated={fetchAdminData} />
        <QuizPerformance moduleStats={moduleStatsList} />
      </div>

      {/* Full-Width People Directory with Interactive User Management */}
      <UserDirectory
        users={users}
        onAddUser={handleAddUser}
        onUpdateRole={handleUpdateRole}
        onDeleteUser={handleDeleteUser}
        currentUser={currentUser}
      />
    </div>
  );
};

export default AdminDashboard;
