import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { BandwidthProvider } from './context/BandwidthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Page Component Imports
import Login from './pages/Login';
import Overview from './pages/Overview';
import CourseCatalog from './pages/CourseCatalog';
import ModuleWorkspace from './pages/ModuleWorkspace';
import CertificateView from './pages/CertificateView';
import VerifyCertificate from './pages/VerifyCertificate';
import CommunityNoticeboard from './pages/CommunityNoticeboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BandwidthProvider>
          <Routes>
            {/* Public Auth & Certificate Verification Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:certId" element={<VerifyCertificate />} />

            {/* Protected Learner Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Overview />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/course"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CourseCatalog />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/module/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ModuleWorkspace />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CommunityNoticeboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificate"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CertificateView />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BandwidthProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
