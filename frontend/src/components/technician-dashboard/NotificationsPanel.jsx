import React from 'react';
import { BiBell, BiTask, BiChat, BiCircle } from 'react-icons/bi';

const NotificationsPanel = ({ notifications = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT': return <BiTask className="text-primary" />;
      case 'COMMENT': return <BiChat className="text-info" />;
      default: return <BiBell className="text-secondary" />;
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-warning bg-opacity-10 text-warning">
            <BiBell size={18} />
          </div>
          Tech Alerts
        </h3>
        <span className="badge bg-primary bg-opacity-10 text-primary small rounded-pill border border-primary border-opacity-10 px-2 shadow-sm" style={{ fontSize: '0.6rem' }}>
          {notifications.filter(n => !n.read).length} NEW
        </span>
      </div>

      <div className="d-flex flex-column gap-1 overflow-auto custom-scrollbar" style={{ maxHeight: '350px' }}>
        {notifications.length > 0 ? notifications.map((notif, index) => (
          <div 
            key={notif.id || index} 
            className={`p-3 rounded-3 d-flex gap-3 transition-all ${!notif.read ? 'bg-primary bg-opacity-5' : 'hover-bg-light opacity-75'}`}
          >
            <div className="mt-1">{getIcon(notif.type)}</div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <p className={`small mb-1 fw-bold ${!notif.read ? 'text-slate-900' : 'text-slate-500 fw-medium'}`}>{notif.message}</p>
                {!notif.read && <div className="p-1 rounded-circle bg-primary mt-1 shadow-sm" style={{ width: '8px', height: '8px' }} />}
              </div>
              <span className="text-slate-400 fw-medium" style={{ fontSize: '0.65rem' }}>{notif.timestamp}</span>
            </div>
          </div>
        )) : (
          <div className="text-center py-5">
            <BiBell size={32} className="text-slate-200 mb-2" />
            <p className="text-slate-400 small fw-medium">Everything up to date</p>
          </div>
        )}
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .border-light { border-color: #f1f5f9 !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NotificationsPanel;
