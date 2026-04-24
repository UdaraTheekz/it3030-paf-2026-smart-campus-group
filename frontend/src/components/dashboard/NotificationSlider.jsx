import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBell, BiCheckCircle, BiInfoCircle, BiTask, BiChat, BiX } from 'react-icons/bi';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationItem = ({ notification, onMarkRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'BOOKING_UPDATED': return <BiCheckCircle className="text-success" />;
      case 'TICKET_CREATED':
      case 'TICKET_UPDATED': return <BiInfoCircle className="text-primary" />;
      case 'TICKET_ASSIGNED': return <BiTask className="text-warning" />;
      case 'CUSTOM': return <BiChat className="text-info" />;
      default: return <BiBell className="text-secondary" />;
    }
  };

  return (
    <div 
      className={`p-3 border-bottom border-light hover-bg-light transition-all cursor-pointer ${!notification.read ? 'bg-primary bg-opacity-5' : ''}`}
      onClick={() => {
        if (!notification.read) onMarkRead(notification.id);
      }}
    >
      <div className="d-flex gap-3">
        <div className="mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <span className="text-slate-900 small fw-bold">{notification.title}</span>
            {!notification.read && <div className="p-1 rounded-circle bg-primary mt-1 shadow-sm" style={{ width: '8px', height: '8px', flexShrink: 0 }} />}
          </div>
          <p className="text-slate-600 fw-medium mb-1" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{notification.message}</p>
          <span className="text-slate-400 fw-medium" style={{ fontSize: '0.65rem' }}>
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const NotificationSlider = ({ isOpen, onClose }) => {
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 340 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 340 }}
          className="position-fixed end-0 top-0 vh-100 bg-white border-start border-light shadow-2xl"
          style={{ width: '340px', zIndex: 2000 }}
        >
          <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-light bg-light bg-opacity-50">
            <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
              <div className="p-1 rounded bg-primary bg-opacity-10 text-primary">
                <BiBell size={18} />
              </div>
              Notifications
            </h3>
            <button className="btn btn-link text-slate-400 p-0 border-0 hover-text-slate-600 transition-all" onClick={onClose}>
              <BiX size={24} />
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto custom-scrollbar" style={{ height: 'calc(100vh - 150px)' }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} onMarkRead={markRead} />
              ))
            ) : (
              <div className="text-center py-5 mt-5 px-3">
                <div className="p-3 rounded-circle bg-light border border-light d-inline-block mb-3">
                  <BiBell size={32} className="text-slate-200" />
                </div>
                <h4 className="text-slate-700 fw-bold h6 mb-1">All caught up!</h4>
                <p className="text-slate-400 small fw-medium">You have no new notifications right now.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 mt-auto border-top border-light bg-white">
            <button 
              className="btn btn-primary btn-sm w-100 py-2 rounded-3 fw-bold shadow-sm"
              onClick={markAllRead}
              disabled={notifications.every(n => n.read)}
            >
              Mark All as Read
            </button>
          </div>
          <style>{`
            .text-slate-900 { color: #0f172a; }
            .text-slate-700 { color: #334155; }
            .text-slate-600 { color: #475569; }
            .text-slate-400 { color: #94a3b8; }
            .text-slate-200 { color: #e2e8f0; }
            .bg-light { background-color: #f8fafc !important; }
            .border-light { border-color: #f1f5f9 !important; }
            .hover-bg-light:hover { background-color: #f8fafc; }
            .hover-text-slate-600:hover { color: #475569 !important; }
            .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationSlider;
