import React from 'react';
import { motion } from 'framer-motion';
import { BiWrench, BiUser } from 'react-icons/bi';

const TicketList = ({ tickets = [] }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'primary';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED': return 'badge bg-success bg-opacity-10 text-success';
      case 'OPEN': return 'badge bg-primary bg-opacity-10 text-primary';
      case 'IN_PROGRESS': return 'badge bg-warning bg-opacity-10 text-warning';
      case 'CLOSED': return 'badge bg-secondary bg-opacity-10 text-secondary';
      default: return 'badge bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="h6 fw-bold mb-0 text-slate-900 d-flex align-items-center gap-2">
          <div className="p-1 rounded bg-secondary bg-opacity-10 text-slate-600">
            <BiWrench size={18} />
          </div>
          System Support
        </h3>
        <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold" style={{ fontSize: '0.75rem' }}>Track Status</button>
      </div>

      <div className="d-flex flex-column gap-3">
        {tickets.length > 0 ? tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * index }}
            className="p-3 rounded-4 bg-light bg-opacity-40 border border-light hover-bg-white shadow-sm transition-all cursor-pointer"
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="h6 fw-bold text-slate-900 mb-0">{ticket.title}</h4>
              <span className={`badge bg-${getPriorityColor(ticket.priority)} bg-opacity-10 text-${getPriorityColor(ticket.priority)} small rounded-pill border border-${getPriorityColor(ticket.priority)} border-opacity-10 fw-bold`} style={{ fontSize: '0.6rem' }}>
                {ticket.priority}
              </span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2 text-slate-500 fw-medium small">
                <BiUser size={14} className="text-slate-400" />
                <span>{ticket.assignedTechnician || 'Dispatching...'}</span>
              </div>
              <span className={`${getStatusBadge(ticket.status)} fw-bold shadow-sm rounded-pill px-2 py-1`} style={{ fontSize: '0.6rem' }}>
                {ticket.status}
              </span>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-5">
            <div className="p-3 rounded-circle bg-light border border-light d-inline-block mb-3">
              <BiWrench size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 small fw-medium">No maintenance tickets found.</p>
          </div>
        )}
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .hover-bg-white:hover {
          background-color: #fff !important;
          border-color: #e2e8f0 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default TicketList;
