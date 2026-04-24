import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUserPlus, BiUser, BiEnvelope, BiLock } from 'react-icons/bi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', formData);
      login(response.data);
      if (response.data.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else if (response.data.role === 'TECHNICIAN') {
        navigate('/dashboard/technician');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
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
            <BiUserPlus size={32} className="text-primary" />
          </div>
          <h1 className="h3 fw-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 fw-medium">Join the Smart Campus Operations Hub</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small border-0 bg-danger bg-opacity-10 text-danger mb-4 rounded-3 d-flex align-items-center gap-2">
            <BiLock size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label text-slate-600 small fw-bold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400"><BiUser /></span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                placeholder="John Doe"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label text-slate-600 small fw-bold">University Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400"><BiEnvelope /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                placeholder="student.name@campus.edu"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label text-slate-600 small fw-bold">Secure Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400"><BiLock /></span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-100 fw-bold rounded-3 shadow-md mb-4 py-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Establish Identity
          </button>
        </form>

        <p className="text-center mb-0 text-slate-500 small fw-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary text-decoration-none fw-bold">
            Sign In Instead
          </Link>
        </p>
      </motion.div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default Register;
