import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!role) return <Navigate to="/login" replace />;

  const normalizedRole = role.toUpperCase();

  // Role-based redirection logic
  switch (normalizedRole) {
    case 'ADMIN':
      return <Navigate to="/dashboard/admin" replace />;
    case 'TECHNICIAN':
      return <Navigate to="/dashboard/technician" replace />;
    case 'USER':
      return <Navigate to="/dashboard/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
