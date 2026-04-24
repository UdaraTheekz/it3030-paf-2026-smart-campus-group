import React, { useState } from 'react';
import { BiBell, BiLogOut, BiUserCircle } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationSlider from './NotificationSlider';

const Topbar = () => {
  const { user, role, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div 
      className="bg-white border-bottom border-light py-2 px-4 position-sticky top-0 shadow-sm" 
      style={{ zIndex: 900 }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-lg-none">
          <h3 className="h5 fw-bold text-slate-900 mb-0">Smart<span className="text-primary">Campus</span></h3>
        </div>
        
        <div className="ms-auto d-flex align-items-center gap-4">
          <div 
            className="position-relative cursor-pointer p-2 rounded-circle hover-bg-light transition-all"
            onClick={() => setIsNotifOpen(true)}
          >
            <BiBell size={22} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.6rem' }}>
                {unreadCount}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center gap-3 border-start border-light ps-4">
            <div className="text-end d-none d-sm-block">
              <p className="small fw-bold mb-0 text-slate-900">{user}</p>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 py-1 px-2 fw-bold" style={{ fontSize: '0.65rem' }}>
                {role}
              </span>
            </div>
            <div className="dropdown">
              <div 
                className="cursor-pointer p-1 rounded-circle border border-light shadow-sm" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <BiUserCircle size={32} className="text-slate-400" />
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-light bg-white p-2 mt-2">
                <li>
                  <button className="dropdown-item rounded-2 text-slate-700 small py-2 d-flex align-items-center gap-2 fw-medium" onClick={() => logout()}>
                    <BiLogOut />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #f1f5f9 !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .cursor-pointer { cursor: pointer; }
      `}</style>
      <NotificationSlider isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};

export default Topbar;
