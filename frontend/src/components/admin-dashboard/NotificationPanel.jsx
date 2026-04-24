import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBell, BiCalendarEvent, BiWrench, BiUserVoice, BiCircle } from 'react-icons/bi';

const NotificationItem = ({ item }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING': return <BiCalendarEvent size={18} className="text-primary" />;
      case 'TICKET': return <BiWrench size={18} className="text-warning" />;
      case 'USER': return <BiUserVoice size={18} className="text-info" />;
      default: return <BiBell size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className={`p-3 border-bottom border-light transition-all ${!item.read ? 'bg-primary bg-opacity-5' : 'hover-bg-light'}`}>
      <div className="d-flex gap-3">
        <div className="mt-1">
          {getIcon(item.type)}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <p className={`small mb-1 ${item.read ? 'text-slate-500' : 'text-slate-900 fw-bold'}`}>
              {item.message}
            </p>
            {!item.read && <div className="p-1 rounded-circle bg-primary mt-1 shadow-sm" style={{ width: '8px', height: '8px' }} />}
          </div>
          <span className="text-slate-400 fw-medium" style={{ fontSize: '0.65rem' }}>{item.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

const NotificationPanel = ({ notifications = [] }) => {
  return (
    <div className="glass-card h-100 border border-white d-flex flex-column shadow-sm bg-white bg-opacity-80">
      <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <BiBell size={18} className="text-primary" /> 
          Admin Notifications
        </h3>
        <span className="badge bg-primary bg-opacity-10 text-primary small rounded-pill border border-primary border-opacity-10 px-2 shadow-sm" style={{ fontSize: '0.6rem' }}>
          {notifications.filter(n => !n.read).length} NEW
        </span>
      </div>

      <div className="flex-grow-1 overflow-auto custom-scrollbar" style={{ maxHeight: '420px' }}>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <NotificationItem key={notif.id || index} item={notif} />
          ))
        ) : (
          <div className="text-center py-5">
            <BiBell size={32} className="text-slate-200 mb-2" />
            <p className="text-slate-400 small fw-medium">No active notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-top border-light mt-auto">
        <button className="btn btn-white btn-sm w-100 rounded-pill border-light py-2 text-slate-600 fw-bold shadow-sm ls-wide transition-all" style={{ fontSize: '0.65rem' }}>
          VIEW ALL ADMIN ALERTS
        </button>
      </div>

      <style>{`
        .btn-white { background: #fff; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .border-light { border-color: #f1f5f9 !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .ls-wide { letter-spacing: 0.05em; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
