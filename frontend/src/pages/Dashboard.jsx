import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BiLogOut, BiUser, BiShieldAlt2 } from 'react-icons/bi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, role, logout } = useAuth();

  return (
    <div className="container py-5">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="h2 fw-bold gradient-text mb-0">Smart Campus Hub</h1>
          <button
            onClick={logout}
            className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-opacity-25"
          >
            <BiLogOut />
            Logout
          </button>
        </header>

        <div className="row g-4">
          <div className="col-md-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 h-100"
            >
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-primary bg-opacity-10">
                  <BiUser size={24} className="text-primary" />
                </div>
                <h2 className="h5 fw-semibold mb-0">Profile Information</h2>
              </div>
              <div className="mb-3">
                <p className="text-secondary small mb-1">Email Address</p>
                <p className="fw-medium mb-0">{user}</p>
              </div>
              <div>
                <p className="text-secondary small mb-1">Account Role</p>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small">
                  {role}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="col-md-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 h-100"
            >
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-warning bg-opacity-10">
                  <BiShieldAlt2 size={24} className="text-warning" />
                </div>
                <h2 className="h5 fw-semibold mb-0">Access Level</h2>
              </div>
              {role === 'ADMIN' ? (
                <p className="text-secondary">You have full administrative access to the Smart Campus Hub.</p>
              ) : role === 'TECHNICIAN' ? (
                <p className="text-secondary">You have Technician access. You can manage maintenance tickets and resources.</p>
              ) : (
                <p className="text-secondary">You have standard user access. Contact an admin for elevated permissions.</p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
