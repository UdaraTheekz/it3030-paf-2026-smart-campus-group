import React from 'react';
import { motion } from 'framer-motion';
import { BiGroup, BiUserCircle, BiShieldQuarter, BiWrench, BiDotsVerticalRounded, BiArrowToRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const UserManagementPanel = ({ users = [], onChangeRole }) => {
  const navigate = useNavigate();
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'TECHNICIAN': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      default: return 'badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
    }
  };

  const getProviderIcon = (provider) => {
    if (provider === 'GOOGLE') return <span className="text-info small ms-1" title="Google OAuth">G</span>;
    return <span className="text-secondary small ms-1" title="Local Account">L</span>;
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-info bg-opacity-10 text-info">
            <BiGroup size={18} />
          </div>
          System User Directory
        </h3>
        <button 
          onClick={() => navigate('/dashboard/admin/users')}
          className="btn btn-link btn-sm text-primary text-decoration-none fw-bold d-flex align-items-center gap-1 shadow-none"
          style={{ fontSize: '0.75rem' }}
        >
          Manage All Users <BiArrowToRight />
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-borderless align-middle mb-0">
          <thead className="bg-light border-bottom border-light text-slate-800 small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            <tr>
              <th className="fw-bold ps-3">User Profile</th>
              <th className="fw-bold text-center">Status</th>
              <th className="fw-bold">Role</th>
              <th className="fw-bold text-end pe-3">Action</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.85rem' }}>
            {users.length > 0 ? users.map((user, index) => (
              <motion.tr 
                key={user.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-3">
                  <div className="d-flex align-items-center gap-3 py-2">
                    <div className="p-2 rounded-circle bg-light border border-light">
                      <BiUserCircle size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="fw-bold text-slate-900 d-flex align-items-center gap-1">
                        {user.name}
                        <span className="badge bg-light text-slate-400 border border-light fw-normal px-1" style={{ fontSize: '0.6rem' }}>{user.provider}</span>
                      </div>
                      <div className="text-slate-500 small" style={{ fontSize: '0.7rem' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                   <span className="p-1 rounded-circle bg-success d-inline-block shadow-sm" style={{ width: '8px', height: '8px' }} title="Active Account"></span>
                </td>
                <td>
                  <span className={getRoleBadge(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td className="text-end pe-3">
                  <div className="dropdown position-static">
                    <button className="btn btn-white btn-icon-sm border-light text-slate-400 shadow-sm rounded-circle" data-bs-toggle="dropdown">
                      <BiDotsVerticalRounded size={20} />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-light bg-white p-2 mt-2">
                      <li className="dropdown-header text-uppercase text-slate-400 fw-bold pb-2" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Change Role</li>
                      <li>
                        <button className="dropdown-item rounded-2 text-slate-700 small py-2 d-flex align-items-center gap-2 fw-medium" onClick={() => onChangeRole(user.id, 'USER')}>
                          Set as Student/User
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item rounded-2 text-warning small py-2 d-flex align-items-center gap-2 fw-medium" onClick={() => onChangeRole(user.id, 'TECHNICIAN')}>
                          <BiWrench /> Promote to Technician
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item rounded-2 text-danger small py-2 d-flex align-items-center gap-2 fw-bold" onClick={() => onChangeRole(user.id, 'ADMIN')}>
                          <BiShieldQuarter /> Grant Admin Rights
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-slate-400 small italic">No user records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .btn-white { background: #fff; }
        .btn-icon-sm { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; padding: 0; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .ls-wide { letter-spacing: 0.05em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .italic { font-style: italic; }
        .dropdown-item:hover { background-color: #f1f5f9 !important; color: #0f172a !important; transition: all 0.2s; }
      `}</style>
    </div>
  );
};

export default UserManagementPanel;
