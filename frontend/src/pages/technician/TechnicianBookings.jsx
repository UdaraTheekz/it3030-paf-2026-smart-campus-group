import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TechnicianSidebar from '../../components/technician-dashboard/TechnicianSidebar';
import TechnicianTopbar from '../../components/technician-dashboard/TechnicianTopbar';
import BookingApprovalPanel from '../../components/admin-dashboard/BookingApprovalPanel';
import BookingDetailsModal from '../../components/technician-dashboard/BookingDetailsModal';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const TechnicianBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/bookings');
      const data = res.data;
      setBookings(data);
      
      setStats({
        total: data.length,
        pending: data.filter(b => b.status === 'PENDING').length,
        approved: data.filter(b => b.status === 'APPROVED').length,
        rejected: data.filter(b => b.status === 'REJECTED').length
      });
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      toast.error("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApproveBooking = async (id) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status?status=APPROVED`);
      toast.success("Booking approved successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to approve booking");
    }
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleRejectBooking = async (id, reason) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status?status=REJECTED&reason=${encodeURIComponent(reason)}`);
      toast.success("Booking rejected");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data || "Failed to reject booking");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100 overflow-hidden">
      <TechnicianSidebar />

      <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ marginLeft: '280px' }}>
        <TechnicianTopbar notificationCount={0} />

        <main className="p-4 p-lg-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 d-flex justify-content-between align-items-end border-bottom border-white pb-4"
          >
            <div>
              <h1 className="h2 fw-bold text-slate-900 mb-2">
                Booking <span className="text-primary">Management</span>
              </h1>
              <p className="text-slate-500 fw-medium">Review and moderate campus resource reservation requests</p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="row g-4 mb-5">
            {[
              { label: 'Total Requests', value: stats.total, color: 'primary' },
              { label: 'Pending Approval', value: stats.pending, color: 'warning' },
              { label: 'Recently Approved', value: stats.approved, color: 'success' },
              { label: 'Rejected', value: stats.rejected, color: 'danger' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="col-12 col-md-6 col-lg-3"
              >
                <div className="glass-card p-4 border border-white shadow-sm h-100">
                  <p className="small fw-bold text-slate-500 text-uppercase ls-wide mb-2">{stat.label}</p>
                  <h3 className={`display-6 fw-bold text-${stat.color} mb-0`}>{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Status Filters */}
          <div className="mb-4 d-flex gap-2">
            {[
              { id: 'ALL', label: 'All Requests' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'REJECTED', label: 'Rejected' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all ${
                  statusFilter === tab.id 
                    ? 'btn-primary shadow-sm' 
                    : 'btn-white text-slate-500 border-light border shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <BookingApprovalPanel 
                bookings={filteredBookings} 
                onApprove={handleApproveBooking} 
                onReject={handleRejectBooking} 
                onViewDetails={handleOpenDetails}
                currentFilter={statusFilter}
              />
            </div>
          </div>
        </main>
      </div>

      <BookingDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
      />

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .ls-wide { letter-spacing: 0.1em; }
        .btn-white { background: #fff; }
        .shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default TechnicianBookings;
