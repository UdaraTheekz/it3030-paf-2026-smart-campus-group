import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BiCheck, BiX, BiInfoCircle } from 'react-icons/bi';
// Modal removed to be handled by parent for better layout

const BookingApprovalPanel = ({ bookings = [], onApprove, onReject, onViewDetails, currentFilter = 'ALL' }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleOpenDetails = (booking) => {
    if (onViewDetails) {
      onViewDetails(booking);
    }
  };

  const handleOpenReject = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    onReject(selectedBooking.id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'PENDING': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'REJECTED': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'CANCELLED': return 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
      default: return 'badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-primary bg-opacity-10 text-primary">
            <BiInfoCircle size={18} />
          </div>
          {currentFilter === 'PENDING' ? 'Booking Approval Queue' : 
           currentFilter === 'ALL' ? 'All Booking Requests' : 
           `${currentFilter.charAt(0) + currentFilter.slice(1).toLowerCase()} Bookings`}
        </h3>
        <button className="btn btn-white btn-sm rounded-pill px-3 py-1 border-light text-slate-500 shadow-sm ls-wide" style={{ fontSize: '0.75rem' }}>VIEW HISTORY</button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-borderless align-middle mb-0">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide ps-3" style={{ fontSize: '0.65rem' }}>User</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Resource</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide text-center" style={{ fontSize: '0.65rem' }}>Date & Time</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Purpose</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Contact</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Status</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide text-end pe-3" style={{ fontSize: '0.65rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.85rem' }}>
            {bookings.length > 0 ? bookings.map((booking, index) => (
              <motion.tr 
                key={booking.id || index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-3">
                  <div className="fw-bold text-slate-900">{booking.userName}</div>
                  <div className="text-muted small" style={{ fontSize: '0.7rem' }}>ID: {booking.userId || 'N/A'}</div>
                </td>
                <td className="text-slate-700 fw-medium">{booking.resourceName}</td>
                <td className="text-center">
                  <div className="text-slate-900">{booking.date}</div>
                  <div className="text-slate-500 small" style={{ fontSize: '0.75rem' }}>{booking.timeRange}</div>
                </td>
                <td>
                  <div className="text-slate-700 small text-truncate" style={{ maxWidth: '120px' }} title={booking.purpose}>
                    {booking.purpose}
                  </div>
                </td>
                <td className="text-slate-700 small">{booking.phoneNumber}</td>
                <td>
                  <span className={getStatusBadge(booking.status)}>
                    {booking.status}
                  </span>
                </td>
                <td className="pe-3 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    {booking.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => onApprove(booking.id || booking._id)}
                          className="btn btn-primary btn-icon-sm shadow-sm rounded-circle"
                          title="Approve"
                        >
                          <BiCheck size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenReject(booking)}
                          className="btn btn-white btn-icon-sm border-light text-danger shadow-sm rounded-circle"
                          title="Reject"
                        >
                          <BiX size={18} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleOpenDetails(booking)}
                      className="btn btn-white btn-icon-sm border-light text-slate-500 shadow-sm rounded-circle" 
                      title="View Details"
                    >
                      <BiInfoCircle size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-slate-400 small italic">
                  No {currentFilter !== 'ALL' ? currentFilter.toLowerCase() : ''} bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card bg-white border-white shadow-2xl">
              <div className="modal-header border-bottom border-light bg-light bg-opacity-50">
                <h5 className="modal-title fw-bold text-slate-900">Reject Booking Request</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-slate-600 small mb-3">Provide a reason for rejecting <strong>{selectedBooking?.resourceName}</strong> for <strong>{selectedBooking?.userName}</strong>.</p>
                <textarea 
                  className="form-control bg-light border-light text-slate-800 shadow-none px-3" 
                  rows="4"
                  placeholder="e.g., Resource undergoing maintenance, invalid purpose, etc."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                ></textarea>
              </div>
              <div className="modal-footer border-top border-light">
                <button type="button" className="btn btn-link text-slate-500 text-decoration-none fw-bold" onClick={() => setShowRejectModal(false)}>Cancel Action</button>
                <button type="button" className="btn btn-danger px-4 rounded-3 shadow-sm fw-bold" onClick={handleConfirmReject} disabled={!rejectReason.trim()}>
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon-sm { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; padding: 0; }
        .btn-white { background: #fff; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .ls-wide { letter-spacing: 0.05em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
};

export default BookingApprovalPanel;
