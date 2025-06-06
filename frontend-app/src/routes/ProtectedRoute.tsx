import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/store/authSlice';
import type { User } from '../features/auth/types';
import AppSpinner from '../components/common/AppSpinner';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // Ví dụ: ['admin', 'candidate']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser) as User | null; // Cast to User type
  const isLoading = useAppSelector((state) => state.auth.isLoading); // Đúng với AuthState
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><AppSpinner size="large" tip="Đang tải dữ liệu người dùng..." /></div>;
  }

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập, lưu lại trang muốn truy cập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Người dùng đã đăng nhập nhưng không có quyền truy cập
    // Có thể chuyển hướng đến trang "Access Denied" hoặc trang chủ
    return <Navigate to="/" state={{ accessDenied: true }} replace />; 
  }

  return children; // Cho phép truy cập nếu đã xác thực và có quyền (nếu allowedRoles được cung cấp)
};
export default ProtectedRoute;