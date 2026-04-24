import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BiWrench, BiUserVoice, BiInfoCircle, BiCheckCircle } from 'react-icons/bi';

const TicketManagementPanel = ({ tickets = [], onAssign, onStatusChange }) => {
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
      case 'OPEN': return 'badge bg-primary bg-opacity-10 text-primary';
      case 'IN_PROGRESS': return 'badge bg-warning bg-opacity-10 text-warning';
      case 'CLOSED': return 'badge bg-secondary bg-opacity-10 text-secondary';
      case 'REJECTED': return 'badge bg-danger bg-opacity-10 text-danger';
      default: return 'badge bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-secondary bg-opacity-10 text-slate-600">
            <BiWrench size={18} />
          </div>
          Active Incident Tickets
        </h3>
        <span className="badge bg-white border border-light text-slate-500 px-3 py-1 fw-bold shadow-sm" style={{ fontSize: '0.7rem' }}>
          {tickets.filter(t => t.status !== 'CLOSED').length} ACTIVE
        </span>
      </div>

      <div className="d-flex flex-column gap-3">
        {tickets.length > 0 ? tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-3 rounded-4 bg-light bg-opacity-40 border border-light hover-bg-light transition-all shadow-sm"
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="h6 fw-bold text-slate-900 mb-1">{ticket.title}</h4>
                <div className="d-flex gap-2 align-items-center">
                  <span className="text-slate-500 small fw-medium" style={{ fontSize: '0.7rem' }}>CAT: {ticket.category || 'Maintenance'}</span>
                  <span className={getPriorityBadge(ticket.priority)} style={{ fontSize: '0.6rem' }}>{ticket.priority}</span>
                </div>
              </div>
              <span className={getStatusBadge(ticket.status)} style={{ fontSize: '0.65rem' }}>{ticket.status}</span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="text-slate-400 small mb-0" style={{ fontSize: '0.65rem' }}>Reported By</div>
                <div className="text-slate-800 small d-flex align-items-center gap-1 fw-medium">
                  <BiUserVoice size={12} className="text-primary" />
                  {ticket.reportedBy}
                </div>
              </div>
              <div className="col-6">
                <div className="text-slate-400 small mb-0" style={{ fontSize: '0.65rem' }}>Technician</div>
                <div className="text-slate-800 small d-flex align-items-center gap-1 fw-medium">
                  <BiCheckCircle size={12} className={ticket.assignedTechnician ? 'text-success' : 'text-slate-400'} />
                  {ticket.assignedTechnician || 'Unassigned'}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
              <span className="text-slate-400 small" style={{ fontSize: '0.65rem' }}>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Just now'}</span>
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm rounded-pill px-3 py-1 btn-action-small shadow-sm" onClick={() => onAssign(ticket.id)}>
                  Assign
                </button>
                <button className="btn btn-white btn-sm rounded-pill px-3 py-1 btn-action-small border-light text-slate-600 shadow-sm" onClick={() => onStatusChange(ticket.id)}>
                  Status
                </button>
                <div className="ms-1 d-flex align-items-center opacity-75 cursor-pointer hover-text-primary">
                  <BiInfoCircle size={18} className="text-slate-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-5">
            <BiWrench size={48} className="text-slate-200 mb-3" />
            <p className="text-slate-400 small fw-medium">No active tickets found.</p>
          </div>
        )}
      </div>

      <style>{`
        .btn-white { background: #fff; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .btn-action-small { font-size: 0.65rem; font-weight: 700; text-uppercase: true; letter-spacing: 0.02em; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .hover-text-primary:hover svg { color: var(--bs-primary) !important; transition: color 0.2s; }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
};

export default TicketManagementPanel;
