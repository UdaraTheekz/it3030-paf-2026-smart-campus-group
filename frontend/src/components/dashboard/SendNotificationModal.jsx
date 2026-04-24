import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiSend, BiUserPlus, BiInfoCircle } from 'react-icons/bi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const SendNotificationModal = ({ isOpen, onClose, role }) => {
  const [recipientRole, setRecipientRole] = useState(role === 'ADMIN' ? 'USER' : 'USER');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post('/notifications/send', {
        recipientRole,
        message: message.trim()
      });
      toast.success('Notification sent successfully');
      setMessage('');
      onClose();
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="position-fixed inset-0 min-vh-100 d-flex justify-content-center align-items-center"
        style={{ zIndex: 1050, top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="position-absolute w-100 h-100 bg-dark bg-opacity-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-4 shadow-lg position-relative overflow-hidden"
          style={{ width: '90%', maxWidth: '450px', zIndex: 1051, border: '1.5px solid #e0e7ff' }}
        >
          {/* Header */}
          <div className="p-3 px-4 border-bottom border-light bg-light d-flex justify-content-between align-items-center">
            <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-800" style={{ fontSize: '0.95rem' }}>
              <div className="p-1 rounded bg-primary bg-opacity-10 text-primary d-flex">
                <BiSend size={18} />
              </div>
              Send Custom Alert
            </h3>
            <button className="btn btn-link text-slate-400 p-0 hover-text-slate-600 transition-all" onClick={onClose}>
              <BiX size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSend} className="p-4 d-flex flex-column gap-3">
            
            {role === 'ADMIN' && (
              <div>
                <label className="form-label small fw-bold text-slate-700 mb-1 d-flex gap-2">
                  <BiUserPlus size={16} className="text-primary mt-1" />
                  Target Audience
                </label>
                <select 
                  className="form-select form-select-sm border-light shadow-sm fw-medium text-slate-700 bg-light"
                  value={recipientRole}
                  onChange={(e) => setRecipientRole(e.target.value)}
                  style={{ borderRadius: '8px', padding: '10px 12px' }}
                >
                  <option value="USER">All Users Only</option>
                  <option value="TECHNICIAN">All Technicians Only</option>
                  <option value="BOTH">Everyone (Users & Technicians)</option>
                </select>
              </div>
            )}

            {role === 'TECHNICIAN' && (
              <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 p-2 px-3">
                <span className="small fw-bold text-primary d-flex align-items-center gap-2">
                  <BiInfoCircle size={16} /> Note: Message will be sent to all users.
                </span>
              </div>
            )}

            <div>
              <label className="form-label small fw-bold text-slate-700 mb-1">Message</label>
              <textarea 
                className="form-control border-light shadow-sm fw-medium text-slate-800"
                rows="4"
                placeholder="Type your alert message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'none', borderRadius: '10px', padding: '12px', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2 pt-3 border-top border-light">
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-light px-4 rounded-pill fw-bold text-slate-600 border border-slate-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                disabled={loading || !message.trim()}
              >
                {loading ? <span className="spinner-border spinner-border-sm" /> : <BiSend />}
                Broadcast Alert
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <style>{`
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-400 { color: #94a3b8; }
        .border-light { border-color: #e2e8f0 !important; }
        .hover-text-slate-600:hover { color: #475569 !important; }
        .bg-light { background-color: #f8fafc !important; }
      `}</style>
    </AnimatePresence>
  );
};

export default SendNotificationModal;
