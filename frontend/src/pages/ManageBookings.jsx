import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiCalendarCheck, 
  BiFilterAlt, 
  BiLoaderAlt,
  BiX,
  BiCheck
} from 'react-icons/bi';
import AdminLayout from '../components/admin-dashboard/AdminLayout';
import AdminBookingTable from '../components/admin-dashboard/AdminBookingTable';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to fetch reservation requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (booking) => {
    if (!window.confirm(`Are you sure you want to approve the reservation for ${booking.resourceName}?`)) return;
    
    try {
      await axiosInstance.patch(`/bookings/${booking.id}/status?status=APPROVED`);
      toast.success("Reservation approved successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve reservation");
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.patch(`/bookings/${selectedBooking.id}/status?status=REJECTED&reason=${encodeURIComponent(rejectionReason)}`);
      toast.success("Reservation request rejected");
      setIsRejectModalOpen(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject reservation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4"
      >
        <div>
          <h2 className="display-6 fw-bold text-slate-900 mb-2">
            Booking <span className="gradient-text">Management</span>
          </h2>
          <p className="text-slate-500 mb-0">Review and moderate campus resource reservation requests from users</p>
        </div>

        <div className="d-flex gap-2">
          <button onClick={fetchBookings} className="btn btn-white border-light text-slate-600 shadow-sm d-flex align-items-center gap-2 px-4">
            <BiFilterAlt /> Refresh Requests
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-5 text-center">
          <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-slate-500 fw-medium">Synchronizing reservation data...</p>
        </div>
      ) : (
        <AdminBookingTable 
          bookings={bookings} 
          onApprove={handleApprove} 
          onReject={openRejectModal} 
        />
      )}

      {/* Rejection Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="modal-overlay d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1100 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card bg-white p-0 border-0 shadow-2xl overflow-hidden"
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <div className="px-4 py-3 border-bottom border-light d-flex justify-content-between align-items-center bg-danger bg-opacity-5">
                <div className="d-flex align-items-center gap-2 text-danger">
                  <BiX size={24} />
                  <h5 className="mb-0 fw-bold">Reject Reservation</h5>
                </div>
                <button onClick={() => setIsRejectModalOpen(false)} className="btn-close shadow-none"></button>
              </div>

              <form onSubmit={handleRejectSubmit} className="p-4">
                <div className="mb-4">
                  <p className="small text-slate-600 mb-3">
                    Are you sure you want to reject the reservation for <strong>{selectedBooking?.resourceName}</strong> 
                    by <strong>{selectedBooking?.userName}</strong>?
                  </p>
                  <label className="form-label small fw-bold text-slate-700">Reason for Rejection</label>
                  <textarea 
                    className="form-control rounded-3 border-light bg-light shadow-none p-3"
                    rows="4"
                    placeholder="Provide a clear reason (e.g., Maintenance scheduled, Prioritization policy...)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-3">
                  <button type="button" onClick={() => setIsRejectModalOpen(false)} className="btn btn-light flex-grow-1 rounded-pill fw-bold text-slate-600 shadow-sm">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn btn-danger flex-grow-1 rounded-pill fw-bold shadow-md d-flex align-items-center justify-content-center gap-2"
                  >
                    {submitting ? <BiLoaderAlt className="spinner-border spinner-border-sm border-0" /> : <BiCheck size={20} />}
                    {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
        }
      `}</style>
    </AdminLayout>
  );
};

export default ManageBookings;
