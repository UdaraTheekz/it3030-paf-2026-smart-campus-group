import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TechnicianSidebar from '../../components/technician-dashboard/TechnicianSidebar';
import TechnicianTopbar from '../../components/technician-dashboard/TechnicianTopbar';
import TicketDetailsModal from '../../components/technician-dashboard/TicketDetailsModal';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { BiTask, BiWrench, BiCheckCircle, BiRefresh, BiInfoCircle, BiPlayCircle } from 'react-icons/bi';

const STATUS_CONFIG = {
  '/dashboard/technician/assigned':    { label: 'Assigned Tickets',  filter: 'OPEN',        icon: <BiTask />,        color: 'primary' },
  '/dashboard/technician/in-progress': { label: 'In Progress',       filter: 'IN_PROGRESS', icon: <BiWrench />,      color: 'warning' },
  '/dashboard/technician/resolved':    { label: 'Resolved Tickets',  filter: 'RESOLVED',    icon: <BiCheckCircle />, color: 'success' },
};

const TechnicianTickets = () => {
  const location = useLocation();
  const config = STATUS_CONFIG[location.pathname] || STATUS_CONFIG['/dashboard/technician/assigned'];

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/tickets/assigned');
      const all = Array.isArray(res.data) ? res.data : [];
      setTickets(all.filter(t => t.status === config.filter));
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  // Re-fetch when the route changes (e.g. switching from assigned → in-progress)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/tickets/${id}/status`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus.replace('_', ' ')}`);
      fetchTickets();
      if (selectedTicket?.id === id) setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleSaveResolution = async (id, notes, resolve = true) => {
    try {
      const newStatus = resolve ? 'RESOLVED' : 'IN_PROGRESS';
      await axiosInstance.patch(`/tickets/${id}/status`, { status: newStatus, notes });
      toast.success(resolve ? 'Ticket resolved and notes saved' : 'Resolution notes saved');
      fetchTickets();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save resolution');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':   return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'MEDIUM': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'LOW':    return 'badge bg-info bg-opacity-10 text-info border border-info border-opacity-25';
      default:       return 'badge bg-secondary bg-opacity-10 text-secondary';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':        return 'badge bg-primary bg-opacity-10 text-primary';
      case 'IN_PROGRESS': return 'badge bg-warning bg-opacity-10 text-warning';
      case 'RESOLVED':    return 'badge bg-success bg-opacity-10 text-success';
      default:            return 'badge bg-secondary bg-opacity-10 text-secondary';
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100 overflow-hidden">
      <TechnicianSidebar />

      <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ marginLeft: '280px' }}>
        <TechnicianTopbar notificationCount={0} />

        <main className="p-4 p-lg-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 d-flex justify-content-between align-items-end border-bottom border-white pb-4"
          >
            <div>
              <h1 className="h2 fw-bold text-slate-900 mb-2 d-flex align-items-center gap-3">
                <span className={`p-2 rounded-3 bg-${config.color} bg-opacity-10 text-${config.color}`}>
                  {config.icon}
                </span>
                {config.label}
              </h1>
              <p className="text-slate-500 fw-medium mb-0">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
            </div>
            <button
              onClick={fetchTickets}
              className="btn btn-white shadow-sm rounded-pill px-4 d-flex align-items-center gap-2 fw-bold text-slate-600 border-light"
            >
              <BiRefresh size={18} /> Refresh
            </button>
          </motion.div>

          {/* Ticket Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-slate-500 mt-3 fw-medium">Loading tickets…</p>
            </div>
          ) : tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className={`p-4 rounded-circle bg-${config.color} bg-opacity-10 d-inline-block mb-4`}>
                <span className={`text-${config.color}`} style={{ fontSize: '2.5rem' }}>{config.icon}</span>
              </div>
              <h3 className="h5 fw-bold text-slate-700 mb-2">No {config.label}</h3>
              <p className="text-slate-400 small">There are currently no tickets in this category assigned to you.</p>
            </motion.div>
          ) : (
            <div className="row g-4">
              <AnimatePresence>
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="col-12 col-md-6 col-xl-4"
                  >
                    <div className="bg-white rounded-4 border border-light shadow-sm p-4 h-100 d-flex flex-column hover-shadow transition-all">
                      {/* Card Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1 me-2">
                          <h4 className="h6 fw-bold text-slate-900 mb-2">{ticket.title}</h4>
                          <div className="d-flex flex-wrap gap-2">
                            <span className="text-slate-500 small">{ticket.category}</span>
                            <span className={getPriorityBadge(ticket.priority)} style={{ fontSize: '0.65rem' }}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <span className={getStatusBadge(ticket.status)} style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                          {ticket.status?.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="mb-3 p-2 rounded-3 bg-light">
                        <p className="mb-0 text-slate-400 small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Location</p>
                        <p className="mb-0 text-slate-700 small fw-medium">{ticket.resourceName || ticket.location || 'Unknown'}</p>
                      </div>

                      {/* Reporter & Date */}
                      <div className="row g-2 mb-4">
                        <div className="col-6">
                          <p className="mb-0 text-slate-400 small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Reported By</p>
                          <p className="mb-0 text-slate-700 small fw-medium text-truncate">{ticket.reporterName || ticket.reportedBy || 'Unknown'}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-0 text-slate-400 small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Date Reported</p>
                          <p className="mb-0 text-slate-700 small fw-medium text-truncate">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown'}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-3 border-top border-light d-flex gap-2">
                        <button
                          className="btn btn-white btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 border-light text-slate-600 shadow-sm fw-bold"
                          onClick={() => { setSelectedTicket(ticket); setIsModalOpen(true); }}
                          style={{ fontSize: '0.7rem' }}
                        >
                          <BiInfoCircle /> Details
                        </button>
                        {ticket.status === 'OPEN' && (
                          <button
                            className="btn btn-primary btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                            style={{ fontSize: '0.7rem' }}
                          >
                            <BiPlayCircle /> Start
                          </button>
                        )}
                        {ticket.status === 'IN_PROGRESS' && (
                          <button
                            className="btn btn-success btn-sm rounded-pill px-3 py-1 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold text-white"
                            onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                            style={{ fontSize: '0.7rem' }}
                          >
                            <BiCheckCircle /> Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onUpdateStatus={handleUpdateStatus}
        onSaveNote={handleSaveResolution}
      />

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
        .hover-shadow:hover { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important; }
        .transition-all { transition: all 0.2s ease; }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default TechnicianTickets;
