import React from 'react';
import { motion } from 'framer-motion';
import { BiTimeFive, BiCheckCircle, BiWrench, BiUserVoice, BiPlusCircle } from 'react-icons/bi';

const ActivityItem = ({ activity, index, total }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED': return <BiCheckCircle className="text-success" />;
      case 'TICKET_ASSIGNED': return <BiWrench className="text-primary" />;
      case 'RESOURCE_UPDATED': return <BiPlusCircle className="text-info" />;
      case 'USER_REGISTERED': return <BiUserVoice className="text-warning" />;
      default: return <BiTimeFive className="text-slate-400" />;
    }
  };

  return (
    <div className="position-relative ps-4 pb-4">
      {/* Timeline Line */}
      {index !== total - 1 && (
        <div 
          className="position-absolute start-0 h-100 bg-light shadow-sm" 
          style={{ width: '2px', left: '10px', top: '24px' }}
        ></div>
      )}
      
      {/* Timeline Dot/Icon */}
      <div 
        className="position-absolute start-0 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
        style={{ width: '22px', height: '22px', left: '0', top: '2px', border: '1px solid #f1f5f9' }}
      >
        {React.cloneElement(getIcon(activity.type), { size: 12 })}
      </div>

      <div className="ms-2">
        <p className="small text-slate-800 mb-0 fw-bold">{activity.message}</p>
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className="text-slate-500" style={{ fontSize: '0.65rem' }}>{activity.user || 'System'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400" style={{ fontSize: '0.65rem' }}>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivities = ({ activities = [] }) => {
  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm bg-white bg-opacity-80">
      <h3 className="h6 fw-bold mb-4 d-flex align-items-center gap-2 text-slate-900">
        <div className="p-1 rounded bg-info bg-opacity-10 text-info">
          <BiTimeFive size={18} />
        </div>
        Operational Pulse
      </h3>

      <div className="mt-2">
        {activities.length > 0 ? activities.map((act, index) => (
          <motion.div
            key={act.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ActivityItem activity={act} index={index} total={activities.length} />
          </motion.div>
        )) : (
          <div className="text-center py-5">
            <BiTimeFive size={32} className="text-slate-200 mb-2" />
            <p className="text-slate-400 small fw-medium">No recent activities recorded.</p>
          </div>
        )}
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-300 { color: #cbd5e1; }
        .text-slate-200 { color: #e2e8f0; }
        .bg-light { background-color: #f8fafc !important; }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
};

export default RecentActivities;
