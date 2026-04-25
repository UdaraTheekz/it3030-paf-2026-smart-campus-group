import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiArrowBack, 
  BiFilterAlt, 
  BiCalendarCheck, 
  BiLoaderAlt,
  BiX,
  BiCheckCircle,
  BiTimeFive,
  BiBuilding,
  BiInfoCircle,
  BiTrash
} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  
  const filters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/bookings/my');
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };


  

  useEffect(() => {
    if (selectedFilter === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === selectedFilter));
    }
  }, [selectedFilter, bookings]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    
    try {
      await axiosInstance.patch(`/bookings/${id}/status?status=CANCELLED`);
      toast.success("Booking cancelled successfully");
      fetchMyBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'REJECTED': return 'bg-danger';
      case 'CANCELLED': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar active="bookings" />
      
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '280px' }}>
        <Topbar />
        
        <main className="p-4 p-lg-5">
          {/* Header section */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div className="d-flex align-items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard/user')}
                className="btn btn-icon btn-white shadow-sm border border-light text-slate-600 rounded-circle p-2"
              >
                <BiArrowBack size={20} />
              </button>
              <div>
                <h2 className="display-6 fw-bold text-slate-900 mb-1">
                  My <span className="gradient-text">Bookings</span>
                </h2>
                <p className="text-slate-500 mb-0">Track and manage your campus resource reservations</p>
              </div>
            </div>

            <div className="d-flex gap-2 bg-white p-1 rounded-pill shadow-sm border border-light">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                    selectedFilter === filter 
                    ? 'btn-primary shadow-sm' 
                    : 'btn-link text-slate-500 text-decoration-none hover-bg-light'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
              <p className="text-slate-500 fw-medium">Retrieving your requests...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="row g-4">
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="col-12"
                  >
                    <div className="glass-card bg-white border-white p-4 hover-shadow-lg transition-all border border-light shadow-sm">
                      <div className="row align-items-center g-4">
                        <div className="col-auto">
                          <div className={`p-3 rounded-4 ${getStatusBadge(booking.status)} bg-opacity-10 text-${getStatusBadge(booking.status).replace('bg-', '')}`}>
                            <BiCalendarCheck size={32} />
                          </div>
                        </div>
                        
                        <div className="col">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h3 className="h5 fw-bold text-slate-900 mb-0">{booking.resourceName}</h3>
                            <span className={`badge px-3 py-1 rounded-pill fw-bold border border-white shadow-sm ${getStatusBadge(booking.status)} text-white`} style={{ fontSize: '0.65rem' }}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="row g-3">
                            <div className="col-auto d-flex align-items-center gap-2 text-slate-500 small">
                              <BiTimeFive className="text-primary" />
                              <span className="fw-medium">{booking.date} • {booking.timeRange}</span>
                            </div>
                            <div className="col-auto d-flex align-items-center gap-2 text-slate-500 small">
                              <BiBuilding className="text-primary" />
                              <span className="fw-medium">Campus Facility</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-auto d-flex gap-2">
                          {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
                            >
                              <BiTrash /> Cancel
                            </button>
                          )}
                          <div className="p-2 rounded-circle bg-light text-slate-400 cursor-help" title={`Created: ${new Date(booking.createdAt).toLocaleString()}`}>
                            <BiInfoCircle size={18} />
                          </div>
                        </div>
                      </div>
                      
                      {booking.reason && (
                        <div className="mt-3 p-3 rounded-3 bg-light border-start border-danger border-4 small text-slate-600">
                          <strong className="text-danger d-block mb-1">Reason for {booking.status.toLowerCase()}:</strong>
                          {booking.reason}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="p-4 rounded-circle bg-white shadow-sm border border-light d-inline-block mb-3">
                <BiFilterAlt size={48} className="text-slate-200" />
              </div>
              <h4 className="h5 fw-bold text-slate-900">No bookings found</h4>
              <p className="text-slate-500">You haven't made any resource requests yet.</p>
              <button 
                onClick={() => navigate('/dashboard/user/book-assets')} 
                className="btn btn-primary rounded-pill px-4 fw-bold mt-2 shadow-sm"
              >
                Browse Assets to Book
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .bg-light { background-color: #f8fafc !important; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background-color: #ffffff; border: 1px solid #f1f5f9; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-shadow-lg:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
        .cursor-help { cursor: help; }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
