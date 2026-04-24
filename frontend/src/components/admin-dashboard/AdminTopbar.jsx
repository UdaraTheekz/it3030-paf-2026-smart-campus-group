import React, { useState } from 'react';
import { BiBell, BiSearch, BiUserCircle, BiLogOut, BiSend } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationSlider from '../dashboard/NotificationSlider';
import SendNotificationModal from '../dashboard/SendNotificationModal';

const AdminTopbar = () => {
  const { user, role, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <div 
      className="bg-white bg-opacity-80 border-bottom border-light py-2 px-4 position-sticky top-0" 
      style={{ zIndex: 999, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center flex-grow-1" style={{ maxWidth: '400px' }}>
          <div className="input-group input-group-sm bg-light rounded-3 border border-light">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <BiSearch size={18} />
            </span>
            <input 
              type="text" 
              className="form-control bg-transparent border-0 text-slate-800 shadow-none" 
              placeholder="Search resources, users, or tickets..." 
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>
        
        <div className="ms-auto d-flex align-items-center gap-4">
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm fw-bold"
            onClick={() => setIsSendModalOpen(true)}
          >
            <BiSend size={16} /> <span className="d-none d-sm-inline">Send Broadcast</span>
          </button>

          <div 
            className="position-relative cursor-pointer hover-opacity-75 p-2 rounded-circle hover-bg-light"
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
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 py-1 px-2" style={{ fontSize: '0.65rem' }}>
                ADMIN PANEL
              </span>
            </div>
            
            <div className="dropdown">
              <div 
                className="cursor-pointer d-flex align-items-center gap-2" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <div className="p-1 rounded-circle bg-primary bg-opacity-5 border border-primary border-opacity-10">
                  <BiUserCircle size={32} className="text-primary" />
                </div>
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-light bg-white p-2 mt-2" style={{ minWidth: '200px' }}>
                <li className="px-3 py-2 mb-2 border-bottom border-light">
                  <p className="small fw-bold text-slate-900 mb-0">{user}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>System Administrator</p>
                </li>
                <li>
                  <button className="dropdown-item rounded-2 text-danger small py-2 d-flex align-items-center gap-2 mt-1" onClick={logout}>
                    <BiLogOut /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-500 { color: #64748b; }
        .bg-light { background-color: #f1f5f9 !important; }
        .border-light { border-color: #e2e8f0 !important; }
        .hover-bg-light:hover { background-color: #f1f5f9; }
        .hover-opacity-75:hover { opacity: 0.75; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
      <NotificationSlider isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <SendNotificationModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} role="ADMIN" />
    </div>
  );
};

export default AdminTopbar;
