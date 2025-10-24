import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { state } = useApp();

  // Если пользователь не авторизован
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если требуется права администратора, но пользователь не админ
  if (adminOnly && !state.user?.is_superuser && !state.user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
