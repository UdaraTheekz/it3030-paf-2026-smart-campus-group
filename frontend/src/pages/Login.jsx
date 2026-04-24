import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiLogIn, BiEnvelope, BiLock } from 'react-icons/bi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      login(response.data);
      if (response.data.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else if (response.data.role === 'TECHNICIAN') {
        navigate('/dashboard/technician');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4 bg-light">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 shadow-2xl w-100 bg-white" 
        style={{ maxWidth: '450px' }}
      >
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary bg-opacity-10 p-3 mb-3 shadow-sm border border-primary border-opacity-10">
            <BiLogIn size={32} className="text-primary" />
          </div>
          <h1 className="h3 fw-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 fw-medium">Unified access point for Smart Campus Hub</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small border-0 bg-danger bg-opacity-10 text-danger mb-4 rounded-3 d-flex align-items-center gap-2">
            <BiLock size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label text-slate-600 small fw-bold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400"><BiEnvelope /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                placeholder="university-id@campus.com"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="mb-4 position-relative">
            <div className="d-flex justify-content-between">
              <label className="form-label text-slate-600 small fw-bold">Secure Password</label>
              <a href="#" className="small text-primary text-decoration-none fw-bold" style={{ fontSize: '0.75rem' }}>Forgot?</a>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400"><BiLock /></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                placeholder="********"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-100 fw-bold rounded-3 shadow-md mb-3 py-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Sign Into Console
          </button>
        </form>

        <div className="my-4 position-relative text-center">
          <hr className="text-light opacity-100" />
          <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-slate-400 small fw-bold ls-wide" style={{ fontSize: '0.65rem' }}>
            OAUTH AUTHENTICATION
          </span>
        </div>

        <div className="d-flex justify-content-center mb-4 pb-2" style={{ width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  await googleLogin(credentialResponse.credential);
                  toast.success('Successfully logged in with Google');
                  navigate('/dashboard');
                } catch (err) {
                  toast.error('Google login failed. Please try again.');
                  setLoading(false);
                }
              }}
              onError={() => {
                toast.error('Google login failed.');
              }}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        <p className="text-center mb-0 text-slate-500 small fw-medium">
          New to the platform?{' '}
          <Link to="/register" className="text-primary text-decoration-none fw-bold">
            Create System Account
          </Link>
        </p>
      </motion.div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .ls-wide { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};

export default Login;
