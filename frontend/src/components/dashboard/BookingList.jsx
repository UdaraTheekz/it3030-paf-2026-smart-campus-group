import React from 'react';
import { motion } from 'framer-motion';
import { BiCalendarCheck } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const BookingList = ({ bookings = [] }) => {
  const navigate = useNavigate();
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge bg-success bg-opacity-10 text-success';
      case 'PENDING': return 'badge bg-warning bg-opacity-10 text-warning';
      case 'REJECTED': return 'badge bg-danger bg-opacity-10 text-danger';
      case 'CANCELLED': return 'badge bg-secondary bg-opacity-10 text-secondary';
      default: return 'badge bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 overflow-hidden shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="h6 fw-bold mb-0 text-slate-900 d-flex align-items-center gap-2">
          <div className="p-1 rounded bg-info bg-opacity-10 text-info">
            <BiCalendarCheck size={18} />
          </div>
          Recent Activity
        </h3>
        <button 
          onClick={() => navigate('/dashboard/user/bookings')}
          className="btn btn-link btn-sm text-primary text-decoration-none fw-bold" 
          style={{ fontSize: '0.75rem' }}
        >
          View History
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover table-borderless align-middle mb-0 custom-table">
          <thead className="text-slate-400 small">
            <tr>
              <th className="fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Facility / Resource</th>
              <th className="fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Scheduled</th>
              <th className="fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Window</th>
              <th className="fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Current Status</th>
            </tr>
          </thead>
          <tbody className="small">
            {bookings.length > 0 ? bookings.map((booking, index) => (
              <motion.tr 
                key={booking.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <td className="fw-bold text-slate-900 py-3">{booking.resourceName}</td>
                <td className="text-slate-600 py-3 fw-medium">{booking.date}</td>
                <td className="text-slate-600 py-3 fw-medium">{booking.time}</td>
                <td className="py-3">
                  <span className={`${getStatusBadge(booking.status)} px-3 py-1 fw-bold rounded-pill shadow-sm`} style={{ fontSize: '0.65rem' }}>
                    {booking.status}
                  </span>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center text-slate-400 py-5 fw-medium">No system activity detected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-600 { color: #475569; }
        .text-slate-400 { color: #94a3b8; }
        .ls-wide { letter-spacing: 0.1em; }
        .custom-table tbody tr {
          transition: all 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-table tbody tr:hover {
          background-color: #f8fafc !important;
          transform: scale(1.005);
        }
      `}</style>
    </div>
  );
};

export default BookingList;
