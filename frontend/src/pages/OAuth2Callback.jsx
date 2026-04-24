import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await axiosInstance.get('/auth/oauth2/success');
        login(response.data);
        if (response.data.role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else if (response.data.role === 'TECHNICIAN') {
          navigate('/dashboard/technician');
        } else {
          navigate('/dashboard/user');
        }
      } catch (error) {
        console.error("OAuth2 failed", error);
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [login, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
