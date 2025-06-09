import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './store/hooks'; 
import { loadUserFromStorage, selectAuthStatus } from './features/auth/store/authSlice'; 
import AdminLayout from './layouts/AdminLayout';
import ClientOnly from './components/ClientOnly'; // <-- BƯỚC 1: IMPORT ClientOnly

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
const CandidateProfilePage = lazy(() => import('./features/candidate/pages/CandidateProfilePage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage'));
const AdminManageUniversities = lazy(() => import('./features/admin/pages/AdminManageUniversities'));
const AdminManageMajors = lazy(() => import('./features/admin/pages/AdminManageMajors'));
const AdminManageAdmissionMethods = lazy(() => import('./features/admin/pages/AdminManageAdmissionMethods'));
const AdminManageApplications = lazy(() => import('./features/admin/pages/AdminManageApplications'));
const AdminManageSubjectGroups = lazy(() => import('./features/admin/pages/AdminManageSubjectGroups'));
const AdminManageAdmissionLinks = lazy(() => import('./features/admin/pages/AdminManageAdmissionLinks'));
const AdminStatsPage = lazy(() => import('./features/admin/pages/AdminStatsPage'));
const AdminManageUsers = lazy(() => import('./features/admin/pages/AdminManageUsers'));


function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    // Chỉ gọi một lần khi app khởi động để kiểm tra trạng thái đăng nhập
    if (authStatus === 'loading') {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, authStatus]);

  // "Cổng chờ" để đảm bảo các chức năng hoạt động đúng
  if (authStatus === 'loading') {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Đang khởi tạo ứng dụng..." />
      </Layout>
    );
  }

  // Render ứng dụng với HomePage được bọc an toàn
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
      <Routes>
        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          {/* ======================================================== */}
          {/* BƯỚC 2: BỌC HOMEPAGE BẰNG ClientOnly ĐỂ CÔ LẬP LỖI */}
          {/* ======================================================== */}
          <Route 
            path="/" 
            element={
              <ClientOnly fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
                <HomePage />
              </ClientOnly>
            } 
          />
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
          <Route 
            path="/candidate/profile" 
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Admin Layout */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/universities" element={<AdminManageUniversities />} />
          <Route path="/admin/majors" element={<AdminManageMajors />} />
          <Route path="/admin/admission-methods" element={<AdminManageAdmissionMethods />} />
          <Route path="/admin/applications" element={<AdminManageApplications />} />
          <Route path="/admin/subject-groups" element={<AdminManageSubjectGroups />} />
          <Route path="/admin/admission-links" element={<AdminManageAdmissionLinks />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
          <Route path="/admin/users" element={<AdminManageUsers />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
export default App;
