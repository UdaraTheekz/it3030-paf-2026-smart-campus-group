import React from 'react';
import { 
  BiTask, 
  BiWrench, 
  BiCheckCircle, 
  BiBell 
} from 'react-icons/bi';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="col-12 col-sm-6 col-xl-3"
  >
    <div className="glass-card p-4 h-100 shadow-sm border border-white">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className={`p-3 rounded-4 bg-${color} bg-opacity-10 shadow-sm border border-${color} border-opacity-10`}>
          {React.cloneElement(icon, { size: 24, className: `text-${color}` })}
        </div>
      </div>
      <div>
        <h3 className="h6 text-slate-500 fw-bold text-uppercase ls-wide mb-1" style={{ fontSize: '0.65rem' }}>{title}</h3>
        <p className="h3 fw-bold mb-0 text-slate-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const TechnicianStatsCards = ({ stats }) => {
  const cardsData = [
    { title: 'Assigned Tickets', value: stats.assignedTickets || 0, icon: <BiTask />, color: 'primary', delay: 0.1 },
    { title: 'In Progress', value: stats.inProgressTickets || 0, icon: <BiWrench />, color: 'warning', delay: 0.2 },
    { title: 'Resolved', value: stats.resolvedTickets || 0, icon: <BiCheckCircle />, color: 'success', delay: 0.3 },
    { title: 'Notifications', value: stats.notifications || 0, icon: <BiBell />, color: 'info', delay: 0.4 },
  ];

  return (
    <div className="row g-4 mb-5">
      {cardsData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default TechnicianStatsCards;
