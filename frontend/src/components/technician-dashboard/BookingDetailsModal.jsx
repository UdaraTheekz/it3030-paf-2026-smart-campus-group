import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiX, 
  BiCalendar, 
  BiTime, 
  BiUser, 
  BiBuildings, 
  BiMap, 
  BiInfoCircle, 
  BiCheck, 
  BiErrorCircle,
  BiLoaderAlt
} from 'react-icons/bi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const BookingDetailsModal = ({ isOpen, onClose, booking, onApprove, onReject }) => {
  const [resource, setResource] = useState(null);
  const [loadingResource, setLoadingResource] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      const resourceId = booking.resourceId;
      if (resourceId) {
        fetchResourceDetails(resourceId);
      }
      setShowRejectInput(false);
      setRejectReason('');
    }
  }, [isOpen, booking]);

  const fetchResourceDetails = async (resourceId) => {
    setLoadingResource(true);
    try {
      const response = await axiosInstance.get(`/resources/${resourceId}`);
      setResource(response.data);
    } catch (err) {
      console.error("Failed to fetch resource details", err);
    } finally {
      setLoadingResource(false);
    }
  };

  const handleReject = async () => {
    const bookingId = booking.id || booking._id;
    if (!bookingId) {
       toast.error("Cannot reject: Booking ID is missing");
       return;
    }
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    setActionLoading(true);
    try {
      await onReject(bookingId, rejectReason);
      onClose();
    } catch (err) {
      // toast is usually handled by parent but we'll be safe
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    const bookingId = booking.id || booking._id;
    if (bookingId) {
      setActionLoading(true);
      try {
        await onApprove(bookingId);
        onClose();
      } catch (err) {
        console.error("Approval failed", err);
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error("Error: Booking identification failed.");
    }
  };

  if (!isOpen || !booking) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="booking-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div 
            key="booking-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-4 shadow-2xl overflow-hidden border-0"
            style={{ 
              width: '95%',
              maxWidth: '800px',
              zIndex: 9999,
              position: 'relative'
            }}
          >
          {/* Header */}
          <div className="p-4 border-bottom border-light bg-white d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold text-slate-900 mb-1">Reservation Request</h5>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge rounded-pill px-3 py-1 ${
                  booking.status === 'PENDING' ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20' :
                  booking.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' :
                  'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20'
                }`}>
                  {booking.status}
                </span>
                <span className="text-slate-400 small">ID: {booking.id || booking._id}</span>
              </div>
            </div>
            <button 
              className="btn btn-light rounded-circle p-2 shadow-none border-0" 
              onClick={onClose}
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <BiX size={24} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="row g-0">
            {/* Booking Information */}
            <div className="col-md-6 p-4 border-end border-light bg-white">
              <h6 className="text-uppercase ls-wide fw-bold text-primary mb-4" style={{ fontSize: '0.75rem' }}>Details Info</h6>
              
              <div className="d-flex flex-column gap-4">
                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-light text-slate-500">
                    <BiUser size={20} />
                  </div>
                  <div>
                    <p className="small text-slate-500 mb-0 ls-sm">USER</p>
                    <p className="fw-bold text-slate-900 mb-0">{booking.userName}</p>
                    <p className="small text-muted mb-0">{booking.userEmail}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-light text-slate-500">
                    <BiCalendar size={20} />
                  </div>
                  <div>
                    <p className="small text-slate-500 mb-0 ls-sm">SCHEDULED DATE</p>
                    <p className="fw-bold text-slate-900 mb-0">{booking.date}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-light text-slate-500">
                    <BiTime size={20} />
                  </div>
                  <div>
                    <p className="small text-slate-500 mb-0 ls-sm">TIME SLOT</p>
                    <p className="fw-bold text-slate-900 mb-0">{booking.timeRange}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-light text-slate-500">
                    <BiInfoCircle size={20} />
                  </div>
                  <div>
                    <p className="small text-slate-500 mb-0 ls-sm">PURPOSE OF RESERVATION</p>
                    <p className="text-slate-800 mb-0" style={{ fontSize: '0.85rem' }}>{booking.purpose}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-light text-slate-500">
                    <BiInfoCircle size={20} />
                  </div>
                  <div>
                    <p className="small text-slate-500 mb-0 ls-sm">CONTACT NUMBER</p>
                    <p className="fw-bold text-slate-900 mb-0">{booking.phoneNumber}</p>
                  </div>
                </div>

                {booking.reason && (
                  <div className="p-3 rounded-3 bg-danger bg-opacity-5 border border-danger border-opacity-10">
                    <p className="small text-danger fw-bold mb-1 d-flex align-items-center gap-1">
                      <BiErrorCircle /> Feedback Note
                    </p>
                    <p className="small text-slate-600 mb-0">{booking.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Asset Information */}
            <div className="col-md-6 p-4 bg-light bg-opacity-50">
              <h6 className="text-uppercase ls-wide fw-bold text-primary mb-4" style={{ fontSize: '0.75rem' }}>Asset Information</h6>
              
              {loadingResource ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-2" style={{ width: '1.5rem', height: '1.5rem' }} />
                  <span className="small text-slate-500">Syncing database...</span>
                </div>
              ) : resource ? (
                <div className="d-flex flex-column gap-3">
                  {resource.imageUrl && (
                    <div className="rounded-3 overflow-hidden border border-white shadow-sm" style={{ height: '120px' }}>
                      <img src={resource.imageUrl} alt={resource.resourceName} className="w-100 h-100 object-fit-cover" />
                    </div>
                  )}
                  <div className="bg-white p-3 rounded-4 shadow-sm border border-white">
                    <p className="fw-bold text-slate-900 mb-1">{resource.resourceName}</p>
                    <p className="small text-slate-500 mb-3">{resource.resourceCode || 'RSC-000'}</p>
                    
                    <div className="d-flex flex-column gap-2 mt-2 pt-2 border-top border-light">
                      <div className="d-flex align-items-center gap-2 small text-slate-600">
                        <BiMap className="text-primary" />
                        <span>{resource.building}, {resource.floor}F, {resource.roomNumber}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 small text-slate-600">
                        <BiInfoCircle className="text-primary" />
                        <span>{resource.resourceType} • CAP {resource.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center rounded-4 border border-dashed border-slate-300">
                  <p className="small text-slate-500 mb-0 italic">Resource reference broken</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-top border-light bg-white">
            {showRejectInput ? (
              <div className="w-100">
                <label className="small fw-bold text-slate-700 mb-2">Specify Rejection Reason</label>
                <textarea 
                  className="form-control border-light bg-light rounded-3 px-3 py-2 mb-3 shadow-none text-slate-800"
                  rows="2"
                  placeholder="e.g., Scheduled maintenance during this slot..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  autoFocus
                ></textarea>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-link text-slate-500 text-decoration-none small fw-bold" onClick={() => setShowRejectInput(false)} disabled={actionLoading}>Cancel</button>
                  <button className="btn btn-danger px-4 py-2 rounded-3 shadow-sm fw-bold d-flex align-items-center gap-2" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
                    {actionLoading && <BiLoaderAlt className="spinner-grow spinner-grow-sm border-0" />}
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : booking.status === 'PENDING' ? (
              <div className="d-flex gap-2 w-100">
                <button className="btn btn-outline-danger flex-grow-1 py-2 fw-bold rounded-3 border-light shadow-none" onClick={() => setShowRejectInput(true)} disabled={actionLoading}>
                  Decline Booking
                </button>
                <button className="btn btn-primary flex-grow-1 py-2 fw-bold rounded-3 shadow-md d-flex align-items-center justify-content-center gap-2" onClick={handleApprove} disabled={actionLoading}>
                  {actionLoading ? <BiLoaderAlt className="spinner-border spinner-border-sm border-0" /> : <BiCheck size={20} />}
                  {actionLoading ? 'Processing...' : 'Approve Request'}
                </button>
              </div>
            ) : (
              <button className="btn btn-light text-slate-600 w-100 py-2 fw-bold rounded-3 border-0" onClick={onClose} disabled={actionLoading}>
                Dismiss View
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
      
      <style>{`
        .ls-wide { letter-spacing: 0.1em; }
        .ls-sm { letter-spacing: 0.05em; font-size: 0.65rem; font-weight: 800; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #f1f5f9 !important; }
        .bg-light { background-color: #f8fafc !important; }
        .object-fit-cover { object-fit: cover; }
        .italic { font-style: italic; }
      `}</style>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookingDetailsModal;
