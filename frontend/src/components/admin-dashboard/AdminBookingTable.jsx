import React from 'react';
import { motion } from 'framer-motion';
import { 
  BiCheckCircle, 
  BiXCircle, 
  BiUser, 
  BiBuilding, 
  BiTimeFive,
  BiInfoCircle
} from 'react-icons/bi';

const AdminBookingTable = ({ bookings, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge bg-success bg-opacity-10 text-success border border-success border-opacity-10';
      case 'PENDING': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10';
      case 'REJECTED': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10';
      case 'CANCELLED': return 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10';
      default: return 'badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10';
    }
  };

  return (
    <div className="glass-card overflow-hidden border border-white shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="ps-4 py-3 text-slate-800 small fw-bold text-uppercase">Requester</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Resource</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Schedule</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Purpose</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Contact</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Status</th>
              <th className="pe-4 py-3 text-slate-800 small fw-bold text-uppercase text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="border-0">
            {bookings.length > 0 ? bookings.map((booking, index) => (
              <motion.tr 
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center">
                      <BiUser size={16} />
                    </div>
                    <div>
                      <div className="fw-bold text-slate-900 small">{booking.userName}</div>
                      <div className="text-slate-500 x-small">{booking.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <BiBuilding className="text-primary opacity-50" />
                    <span className="fw-bold text-slate-800 small">{booking.resourceName}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center gap-2 text-slate-700 small fw-medium">
                      <BiTimeFive size={14} className="text-primary" />
                      {booking.date}
                    </div>
                    <div className="text-slate-500 x-small ps-4">{booking.timeRange}</div>
                  </div>
                </td>
                <td>
                  <div className="text-slate-700 small text-truncate" style={{ maxWidth: '150px' }} title={booking.purpose}>
                    {booking.purpose}
                  </div>
                </td>
                <td className="text-slate-700 small fw-medium">
                  {booking.phoneNumber}
                </td>
                <td>
                  <span className={`${getStatusBadge(booking.status)} px-3 py-1 fw-bold rounded-pill`} style={{ fontSize: '0.65rem' }}>
                    {booking.status}
                  </span>
                </td>
                <td className="pe-4 text-end">
                  {booking.status === 'PENDING' ? (
                    <div className="d-flex justify-content-end gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onApprove(booking)}
                        className="btn btn-sm btn-success d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <BiCheckCircle /> Approve
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onReject(booking)}
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <BiXCircle /> Reject
                      </motion.button>
                    </div>
                  ) : (
                    <div className="p-2 text-slate-400 cursor-help" title={`Decision made: ${new Date(booking.createdAt).toLocaleString()}\n${booking.reason ? 'Reason: ' + booking.reason : ''}`}>
                      <BiInfoCircle size={18} />
                    </div>
                  )}
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="text-slate-400">
                    <BiCalendarCheck size={48} className="mb-3 opacity-25" />
                    <p className="mb-0 small fw-medium">No reservation requests found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .x-small { font-size: 0.7rem; }
        .cursor-help { cursor: help; }
        .hover-bg-light:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

export default AdminBookingTable;
