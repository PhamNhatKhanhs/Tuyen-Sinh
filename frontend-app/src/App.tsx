import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AppSpinner from './components/common/AppSpinner';
import { useAppDispatch } from './store/hooks'; 
import { loadUserFromStorage } from './features/auth/store/authSlice'; 

// Lazy load các components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));
const UniversityListPage = lazy(() => import('./features/university/pages/UniversityListPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Candidate Pages
const CandidateDashboardPage = lazy(() => import('./features/candidate/pages/CandidateDashboardPage'));
const CandidateSubmitApplicationPage = lazy(() => import('./features/candidate/pages/CandidateSubmitApplicationPage'));
const CandidateViewApplicationsPage = lazy(() => import('./features/candidate/pages/CandidateViewApplicationsPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage'));
const AdminManageUniversities = lazy(() => import('./features/admin/pages/AdminManageUniversities'));
const AdminManageMajors = lazy(() => import('./features/admin/pages/AdminManageMajors'));
const AdminManageAdmissionMethods = lazy(() => import('./features/admin/pages/AdminManageAdmissionMethods')); // ĐÃ THÊM TRONG CANVAS TRƯỚC
const AdminManageApplications = lazy(() => import('./features/admin/pages/AdminManageApplications'));
const AdminManageSubjectGroups = lazy(() => import('./features/admin/pages/AdminManageSubjectGroups')); // THÊM MỚI
const AdminManageAdmissionLinks = lazy(() => import('./features/admin/pages/AdminManageAdmissionLinks')); // THÊM MỚI
const AdminStatsPage = lazy(() => import('./features/admin/pages/AdminStatsPage'));
const AdminManageUsers = lazy(() => import('./features/admin/pages/AdminManageUsers'));


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage()); 
  }, [dispatch]);

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><AppSpinner size="large" /></div>}>
      <Routes>
        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/universities" element={<UniversityListPage />} />
          
          {/* Candidate Routes */}
          <Route 
            path="/candidate" 
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Navigate to="/candidate/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/submit-application" 
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateSubmitApplicationPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/candidate/my-applications" 
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateViewApplicationsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                 <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/universities" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageUniversities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/majors" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageMajors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/admission-methods"  // Đảm bảo route này đã có
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageAdmissionMethods />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/applications" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageApplications />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/subject-groups" 
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageSubjectGroups />
            </ProtectedRoute>} /> 

          <Route path="/admin/applications" 
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageApplications />
            </ProtectedRoute>} />
          <Route path="/admin/admission-links" 
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageAdmissionLinks />
            </ProtectedRoute>} />
          <Route path="/admin/stats" 
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminStatsPage />
            </ProtectedRoute>} /> 
          <Route path="/admin/users" 
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageUsers />
            </ProtectedRoute>} />
          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
export default App;