import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role.toUpperCase()))) {
    console.warn(`Access denied for role: ${role}. Required: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
