import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiUserCircle, BiShieldQuarter, BiLockAlt, BiCheckCircle } from 'react-icons/bi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose, user, role }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully');
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="position-fixed inset-0 min-vh-100 d-flex justify-content-center align-items-center"
        style={{ zIndex: 1050, top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="position-absolute w-100 h-100 bg-dark bg-opacity-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-4 shadow-lg position-relative overflow-hidden"
          style={{ width: '90%', maxWidth: '500px', zIndex: 1051, border: '1.5px solid #e0e7ff' }}
        >
          {/* Header */}
          <div className="p-3 px-4 border-bottom border-light bg-light d-flex justify-content-between align-items-center">
            <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-800">
              <div className="p-1 rounded bg-primary bg-opacity-10 text-primary d-flex">
                <BiUserCircle size={20} />
              </div>
              My Profile
            </h3>
            <button className="btn btn-link text-slate-400 p-0 hover-text-slate-600 transition-all" onClick={onClose}>
              <BiX size={24} />
            </button>
          </div>

          <div className="p-4">
            {/* User Info (Read Only) */}
            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3 border border-light">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                <span className="fw-bold fs-4">{user?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="h6 fw-bold text-slate-800 mb-1">{user}</h4>
                <p className="small text-slate-500 mb-0 fw-medium d-flex align-items-center gap-1">
                  <BiShieldQuarter /> Role: {role}
                </p>
              </div>
            </div>

            <hr className="bg-light my-4" />

            <h5 className="h6 fw-bold text-slate-800 mb-3 d-flex align-items-center gap-2">
              <span className="p-1 rounded bg-secondary bg-opacity-10 text-secondary d-flex">
                <BiLockAlt size={16} />
              </span>
              Security settings
            </h5>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-success bg-opacity-10 text-success p-4 rounded-3 text-center border border-success border-opacity-25"
              >
                <BiCheckCircle size={48} className="mb-2" />
                <h5 className="fw-bold h6 mb-1">Password Updated</h5>
                <p className="small mb-0 fw-medium">Your account is secure.</p>
              </motion.div>
            ) : (
              <form onSubmit={handlePasswordChange} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="form-control border-light shadow-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label small fw-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="form-control border-light shadow-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label small fw-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control border-light shadow-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-light">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-light px-4 rounded-pill fw-bold text-slate-600 border border-slate-200"
                  >
                    Close
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm" /> : <BiLockAlt />}
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      <style>{`
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #e2e8f0 !important; }
        .bg-light { background-color: #f8fafc !important; }
        .hover-text-slate-600:hover { color: #475569 !important; }
      `}</style>
    </AnimatePresence>
  );
};

export default ProfileModal;
