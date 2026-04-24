import React from 'react';
import { motion } from 'framer-motion';
import { BiWrench, BiInfoCircle, BiCheckCircle, BiPlayCircle } from 'react-icons/bi';

const AssignedTicketsPanel = ({ tickets = [], onViewDetails, onUpdateStatus }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'MEDIUM': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'LOW': return 'badge bg-info bg-opacity-10 text-info border border-info border-opacity-25';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED': return 'badge bg-success bg-opacity-10 text-success';
      case 'IN_PROGRESS': return 'badge bg-warning bg-opacity-10 text-warning';
      case 'OPEN': return 'badge bg-primary bg-opacity-10 text-primary';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-secondary bg-opacity-10 text-slate-600">
            <BiWrench size={18} />
          </div>
          My Assigned Tasks
        </h3>
        <span className="badge bg-white border border-light text-slate-500 px-3 py-1 fw-bold shadow-sm" style={{ fontSize: '0.7rem' }}>
          {tickets.length} ACTIVE
        </span>
      </div>

      <div className="row g-4">
        {tickets.length > 0 ? tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="col-12 col-md-6"
          >
            <div className="p-4 rounded-4 bg-light bg-opacity-40 border border-light hover-bg-white transition-all h-100 d-flex flex-column shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="flex-grow-1">
                  <h4 className="h6 fw-bold text-slate-900 mb-2">{ticket.title}</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="text-slate-500 small fw-medium" style={{ fontSize: '0.7rem' }}>{ticket.category}</span>
                    <span className={getPriorityBadge(ticket.priority)} style={{ fontSize: '0.65rem' }}>{ticket.priority}</span>
                  </div>
                </div>
                <span className={getStatusBadge(ticket.status)} style={{ fontSize: '0.65rem' }}>{ticket.status}</span>
              </div>

              <div className="mb-4">
                <p className="text-slate-400 small mb-1 fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Facility Location</p>
                <p className="text-slate-700 small mb-0 fw-medium">{ticket.resourceName || 'Unknown Site'}</p>
              </div>

              <div className="mt-auto pt-3 border-top border-light d-flex gap-2">
                <button 
                  className="btn btn-white btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 border-light text-slate-600 shadow-sm fw-bold"
                  onClick={() => onViewDetails(ticket)}
                  style={{ fontSize: '0.7rem' }}
                >
                  <BiInfoCircle /> Details
                </button>
                {ticket.status === 'OPEN' && (
                  <button 
                    className="btn btn-primary btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
                    onClick={() => onUpdateStatus(ticket.id, 'IN_PROGRESS')}
                    style={{ fontSize: '0.7rem' }}
                  >
                    <BiPlayCircle /> Start Task
                  </button>
                )}
                {ticket.status === 'IN_PROGRESS' && (
                  <button 
                    className="btn btn-success btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold text-white"
                    onClick={() => onUpdateStatus(ticket.id, 'RESOLVED')}
                    style={{ fontSize: '0.7rem' }}
                  >
                    <BiCheckCircle /> Resolve
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-12 text-center py-5">
            <div className="p-3 rounded-circle bg-light border border-light d-inline-block mb-3">
              <BiWrench size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 small fw-medium">No assigned tickets found.</p>
          </div>
        )}
      </div>

      <style>{`
        .btn-white { background: #fff; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .ls-wide { letter-spacing: 0.05em; }
        .hover-bg-white:hover { 
          background-color: #fff !important; 
          border-color: #e2e8f0 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default AssignedTicketsPanel;
