import React from 'react';
import { BiPlusCircle, BiWrench, BiCalendarCheck } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const QuickActionBtn = ({ label, icon, color, delay, onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`btn btn-lg bg-${color} bg-opacity-5 py-3 px-4 border border-${color} border-opacity-10 rounded-4 d-flex align-items-center gap-3 w-100 mb-2 transition-all shadow-sm hover-bg-white`}
    style={{ borderStyle: 'dashed' }}
  >
    <div className={`p-2 rounded-3 bg-${color} bg-opacity-10 text-${color} shadow-sm border border-${color} border-opacity-10`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className={`text-slate-700 fw-bold small`}>{label}</span>
  </motion.button>
);

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAction = (label) => {
    if (label === 'Create New Booking') {
      navigate('/dashboard/user/book-assets');
    } else if (label === 'Manage My Bookings') {
      navigate('/dashboard/user/bookings');
    } else if (label === 'Report New Incident') {
      navigate('/dashboard/user/report-incident');
    }
  };

  const actions = [
    { label: 'Create New Booking', icon: <BiPlusCircle />, color: 'primary', delay: 0.5 },
    { label: 'Manage My Bookings', icon: <BiCalendarCheck />, color: 'success', delay: 0.6 },
    { label: 'Report New Incident', icon: <BiWrench />, color: 'warning', delay: 0.7 },
  ];


  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <h3 className="h6 fw-bold mb-4 d-flex align-items-center gap-2 text-slate-900">
        Command Center
      </h3>
      <div className="d-flex flex-column gap-2">
        {actions.map((action, index) => (
          <QuickActionBtn 
            key={index} 
            {...action} 
            onClick={() => handleAction(action.label)}
          />
        ))}
      </div>
      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .hover-bg-white:hover { background-color: #fff !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
      `}</style>
    </div>
  );
};

export default QuickActions;
