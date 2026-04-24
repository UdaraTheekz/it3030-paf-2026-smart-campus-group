import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiCalendar, BiMap, BiUser, BiTag, BiCheckCircle, BiPlayCircle, BiPaperclip, BiLinkExternal } from 'react-icons/bi';
import ResolutionNotesPanel from './ResolutionNotesPanel';

// Resolve URL — handles full Supabase URLs and legacy relative /uploads/ paths
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8080${url}`;
};

const AttachmentTile = ({ url }) => {
  const [broken, setBroken] = useState(false);
  const resolved = resolveUrl(url);
  if (!resolved) return null;

  if (broken) {
    return (
      <a href={resolved} target="_blank" rel="noopener noreferrer"
        style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ede9fe', border: '2px solid #c4b5fd', borderRadius: '12px', textDecoration: 'none', gap: '6px', color: '#6366f1', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', padding: '8px' }}>
        <BiLinkExternal size={22} />
        View File
      </a>
    );
  }

  return (
    <a href={resolved} target="_blank" rel="noopener noreferrer">
      <img
        src={resolved}
        alt="Attachment"
        onError={() => setBroken(true)}
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e0e7ff', boxShadow: '0 4px 12px rgba(99,102,241,0.15)', display: 'block', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
    </a>
  );
};

const TicketDetailsModal = ({ ticket, isOpen, onClose, onUpdateStatus, onSaveNote }) => {
  if (!isOpen || !ticket) return null;

  const priorityConfig = {
    HIGH:   { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', label: '🔴 HIGH PRIORITY' },
    MEDIUM: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', label: '🔵 MEDIUM PRIORITY' },
    LOW:    { bg: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', label: '🟣 LOW PRIORITY' },
  };

  const statusConfig = {
    OPEN:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
    IN_PROGRESS: { bg: '#fef3c7', color: '#d97706', label: 'In Progress' },
    RESOLVED:    { bg: '#d1fae5', color: '#059669', label: 'Resolved' },
    CLOSED:      { bg: '#f3f4f6', color: '#6b7280', label: 'Closed' },
    REJECTED:    { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  };

  const pConf = priorityConfig[ticket.priority] || priorityConfig.LOW;
  const sConf = statusConfig[ticket.status] || statusConfig.OPEN;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          style={{ maxWidth: '960px' }}
        >
          <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', minHeight: '80vh' }}>

            {/* Vibrant Header */}
            <div style={{ background: pConf.bg, padding: '28px 32px 24px' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span style={{
                      background: 'rgba(255,255,255,0.25)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.35)'
                    }}>
                      {pConf.label}
                    </span>
                    <span style={{
                      background: sConf.bg,
                      color: sConf.color,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '50px',
                      letterSpacing: '0.06em'
                    }}>
                      {sConf.label}
                    </span>
                  </div>
                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                    {ticket.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0, fontWeight: 600 }}>
                    Ticket #{ticket.id?.toString().slice(-6) || ticket.id}
                    {ticket.createdAt && ` • Reported on ${new Date(ticket.createdAt).toLocaleString()}`}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <BiX size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="modal-body p-0" style={{ background: '#f8faff' }}>
              <div className="row g-0">
                {/* Full-width Details + Resolution */}
                <div className="col-12 p-4" style={{ overflowY: 'auto', maxHeight: '65vh' }}>

                  {/* Description */}
                  <section className="mb-4">
                    <h3 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Issue Description
                    </h3>
                    <div style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderRadius: '14px', padding: '16px', color: '#374151', fontWeight: 500, lineHeight: 1.7, fontSize: '0.9rem' }}>
                      {ticket.description || 'No detailed description provided.'}
                    </div>
                  </section>

                  {/* Meta Grid */}
                  <div className="row g-3 mb-4">
                    {[
                      { label: 'Location', value: ticket.resourceName || ticket.location || 'Global Campus', icon: <BiMap />, color: '#6366f1', bg: '#ede9fe' },
                      { label: 'Category', value: ticket.category, icon: <BiTag />, color: '#0ea5e9', bg: '#e0f2fe' },
                      { label: 'Reported By', value: ticket.reporterName || ticket.reportedBy || 'Unknown', icon: <BiUser />, color: '#f59e0b', bg: '#fef3c7' },
                      { label: 'Date Reported', value: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A', icon: <BiCalendar />, color: '#10b981', bg: '#d1fae5' },
                    ].map(item => (
                      <div key={item.label} className="col-6">
                        <div style={{ background: '#fff', border: '1.5px solid #e8eeff', borderRadius: '14px', padding: '14px', height: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ background: item.bg, color: item.color, borderRadius: '8px', padding: '4px 6px', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                              {item.icon}
                            </div>
                            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</span>
                          </div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Attachments */}
                  {ticket.attachmentUrls?.length > 0 && (
                    <section className="mb-4">
                      <h3 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BiPaperclip /> Attachments ({ticket.attachmentUrls.length})
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {ticket.attachmentUrls.map((url, i) => (
                          <AttachmentTile key={i} url={url} />
                        ))}
                      </div>
                    </section>
                  )}

                  <div style={{ height: '1px', background: 'linear-gradient(90deg, #6366f1, #a5b4fc, #e0e7ff)', marginBottom: '20px', borderRadius: '2px' }} />

                  {/* Resolution Notes */}
                  <ResolutionNotesPanel
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    onSave={onSaveNote}
                    onResolve={() => onUpdateStatus(ticket.id, 'RESOLVED')}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#fff', borderTop: '1.5px solid #e8eeff', padding: '16px 28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{ background: 'transparent', border: '1.5px solid #c7d2fe', color: '#6366f1', borderRadius: '50px', padding: '8px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Close
              </button>
              {ticket.status === 'OPEN' && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'IN_PROGRESS')}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <BiPlayCircle size={18} /> Start Working
                </button>
              )}
              {ticket.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'RESOLVED')}
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <BiCheckCircle size={18} /> Mark Resolved
                </button>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketDetailsModal;
