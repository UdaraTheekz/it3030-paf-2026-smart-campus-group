import React from 'react';
import { 
  BiTask, 
  BiCheckDouble, 
  BiCalendarX, 
  BiWrench, 
  BiGroup, 
  BiBell 
} from 'react-icons/bi';
import { motion } from 'framer-motion';

const AdminStatsCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="col-12 col-md-4 col-xl-2"
  >
    <div className="glass-card p-3 h-100 shadow-sm border border-white bg-white bg-opacity-80 d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className={`p-2 rounded-3 bg-${color} bg-opacity-10 shadow-sm`}>
          {React.cloneElement(icon, { size: 20, className: `text-${color}` })}
        </div>
      </div>
      <div>
        <p className="small text-slate-500 fw-bold text-uppercase mb-1 line-clamp-1 ls-wide" style={{ fontSize: '0.65rem' }}>{title}</p>
        <h4 className="fw-bold mb-0 text-slate-900">{value}</h4>
      </div>
    </div>
  </motion.div>
);

const AdminStatsCards = ({ stats }) => {
  const cardsData = [
    { title: 'Total Resources', value: stats.totalResources || 0, icon: <BiTask />, color: 'primary', delay: 0.1 },
    { title: 'Active Resources', value: stats.activeResources || 0, icon: <BiCheckDouble />, color: 'success', delay: 0.2 },
    { title: 'Pending Bookings', value: stats.pendingBookings || 0, icon: <BiCalendarX />, color: 'warning', delay: 0.3 },
    { title: 'Open Tickets', value: stats.openTickets || 0, icon: <BiWrench />, color: 'danger', delay: 0.4 },
    { title: 'Total Users', value: stats.totalUsers || 0, icon: <BiGroup />, color: 'info', delay: 0.5 },
    { title: 'Unread Alerts', value: stats.unreadNotifications || 0, icon: <BiBell />, color: 'secondary', delay: 0.6 },
  ];

  return (
    <div className="row g-3 mb-5">
      {cardsData.map((card, index) => (
        <AdminStatsCard key={index} {...card} />
      ))}
      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .ls-wide { letter-spacing: 0.05em; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminStatsCards;
