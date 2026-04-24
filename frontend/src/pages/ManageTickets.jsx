import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiFilter, BiSearch, BiUser, BiCheckCircle, BiErrorCircle,
  BiXCircle, BiRefresh, BiChevronRight, BiTime, 
  BiCommentDetail, BiMap, BiCategory 
} from 'react-icons/bi';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin-dashboard/AdminSidebar';
import AdminTopbar from '../components/admin-dashboard/AdminTopbar';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [assigningId, setAssigningId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTickets, resUsers] = await Promise.all([
        axiosInstance.get('/tickets/all'),
        axiosInstance.get('/users')
      ]);
      setTickets(resTickets.data);
      setTechnicians(resUsers.data.filter(u => u.role === 'TECHNICIAN'));
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!assigningId) return toast.error("Please select a technician");
    try {
      await axiosInstance.patch(`/tickets/${selectedTicket.id}/assign`, { technicianId: assigningId });
      toast.success("Technician assigned");
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return toast.error("Please provide a reason");
    try {
      await axiosInstance.patch(`/tickets/${selectedTicket.id}/reject`, { reason: rejectReason });
      toast.success("Ticket rejected");
      setIsRejectModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-info bg-opacity-10 text-info border-info border-opacity-25';
      case 'IN_PROGRESS': return 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25';
      case 'RESOLVED': return 'bg-success bg-opacity-10 text-success border-success border-opacity-25';
      case 'CLOSED': return 'bg-slate-500 bg-opacity-10 text-slate-500 border-slate-500 border-opacity-25';
      case 'REJECTED': return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25';
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="d-flex bg-slate-50 min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1" style={{ marginLeft: '280px' }}>
        <AdminTopbar />
        
        <main className="p-4 p-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="h2 fw-bold text-slate-900 mb-1">Ticket <span className="text-primary">Management</span></h1>
              <p className="text-slate-500">Monitor and assign incident reports across campus.</p>
            </div>
            <button onClick={fetchData} className="btn btn-white shadow-sm rounded-pill px-4 d-flex align-items-center gap-2 fw-bold text-slate-600 border-light">
              <BiRefresh size={18} /> Refresh
            </button>
          </div>

          <div className="glass-card bg-white p-4 rounded-4 shadow-sm border-0 mb-4">
            <div className="row g-3">
              <div className="col-md-6 col-lg-4">
                <div className="input-group">
                  <span className="input-group-text border-slate-100 bg-slate-50 text-slate-400">
                    <BiSearch />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search by title or reporter..." 
                    className="form-control border-slate-100 focus-ring"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-8">
                <div className="d-flex gap-2 flex-wrap">
                  {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${filter === s ? 'btn-primary shadow-sm' : 'btn-white text-slate-500 border-slate-100'}`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive glass-card bg-white rounded-4 shadow-sm border-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-slate-50">
                <tr>
                  <th className="ps-4 text-slate-500 fw-bold border-0 py-3 small text-uppercase">Incident Detail</th>
                  <th className="text-slate-500 fw-bold border-0 py-3 small text-uppercase">Reporter</th>
                  <th className="text-slate-500 fw-bold border-0 py-3 small text-uppercase">Assigned To</th>
                  <th className="text-slate-500 fw-bold border-0 py-3 small text-uppercase">Status</th>
                  <th className="pe-4 text-end text-slate-500 fw-bold border-0 py-3 small text-uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTickets.map((ticket) => (
                    <motion.tr 
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-bottom border-light cursor-pointer"
                    >
                      <td className="ps-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`p-2 rounded-3 text-white ${ticket.priority === 'HIGH' ? 'bg-danger' : ticket.priority === 'MEDIUM' ? 'bg-warning' : 'bg-info'}`}>
                             <BiErrorCircle size={20} />
                          </div>
                          <div>
                            <div className="fw-bold text-slate-800">{ticket.title}</div>
                            <div className="small text-slate-500 d-flex align-items-center gap-2 mt-1">
                              <span className="badge bg-slate-100 text-slate-500 border-0">{ticket.category}</span>
                              <span className="d-flex align-items-center gap-1"><BiMap /> {ticket.location || ticket.resourceName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar px-2 py-1 bg-primary bg-opacity-10 text-primary rounded fw-bold small">
                            {ticket.reporterName.charAt(0)}
                          </div>
                          <span className="text-slate-700 fw-medium">{ticket.reporterName}</span>
                        </div>
                      </td>
                      <td>
                         <span className={`fw-medium ${ticket.technicianName === 'Unassigned' ? 'text-slate-400' : 'text-primary'}`}>
                            {ticket.technicianName}
                         </span>
                      </td>
                      <td>
                        <span className={`badge border px-3 py-2 rounded-pill ${getStatusStyle(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex gap-2 justify-content-end">
                           {ticket.status === 'OPEN' && (
                             <>
                                <button 
                                  onClick={() => { setSelectedTicket(ticket); setIsAssignModalOpen(true); }}
                                  className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm"
                                >
                                  Assign
                                </button>
                                <button 
                                  onClick={() => { setSelectedTicket(ticket); setIsRejectModalOpen(true); }}
                                  className="btn btn-sm btn-white border-danger text-danger rounded-pill px-3 fw-bold"
                                >
                                  Reject
                                </button>
                             </>
                           )}
                           <button className="btn btn-sm btn-white border-slate-200 text-slate-600 rounded-circle p-2 d-flex align-items-center justify-content-center">
                              <BiChevronRight size={18} />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {!loading && filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-5 text-center text-slate-400">
                       No tickets found matches your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
               <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold text-slate-900">Assign Technician</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setIsAssignModalOpen(false)}></button>
               </div>
               <div className="modal-body p-4">
                  <p className="text-slate-500 mb-4 small">Select a technician to handle: <span className="fw-bold text-slate-800">{selectedTicket?.title}</span></p>
                  <label className="form-label text-slate-700 fw-bold small text-uppercase">Select Technician</label>
                  <select 
                    className="form-select border-2 border-slate-100 rounded-3 focus-ring mb-4"
                    value={assigningId}
                    onChange={(e) => setAssigningId(e.target.value)}
                  >
                    <option value="">Choose a technician...</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name} ({tech.email})</option>
                    ))}
                  </select>
                  <button onClick={handleAssign} className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm">Confirm Assignment</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
               <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold text-slate-900">Reject Ticket</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setIsRejectModalOpen(false)}></button>
               </div>
               <div className="modal-body p-4">
                  <label className="form-label text-slate-700 fw-bold small text-uppercase">Reason for Rejection</label>
                  <textarea 
                    className="form-control border-2 border-slate-100 rounded-3 focus-ring mb-4"
                    rows="3"
                    placeholder="Enter reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                  <button onClick={handleReject} className="btn btn-danger w-100 rounded-pill py-2 fw-bold shadow-sm">Reject Incident</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bg-slate-50 { background-color: #f8fafc; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #f1f5f9 !important; }
        .border-slate-100 { border-color: #f1f5f9 !important; }
        .focus-ring:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
          outline: none;
        }
        .glass-card {
          backdrop-filter: blur(10px);
        }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ManageTickets;
