import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  BiWrench, BiRefresh, BiSearch, BiFilter,
  BiChevronRight, BiCalendar, BiMap, BiErrorCircle,
  BiCheckCircle, BiTime, BiPaperclip, BiX, BiLinkExternal
} from 'react-icons/bi';

// Resolve URL — supports full Supabase URLs and legacy relative /uploads/ paths
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8080${url}`; // legacy local storage path
};

// Attachment tile — shows the image or a styled fallback link on error
const AttachmentTile = ({ url }) => {
  const [broken, setBroken] = useState(false);
  const resolved = resolveUrl(url);
  if (!resolved) return null;

  if (broken) {
    return (
      <a href={resolved} target="_blank" rel="noopener noreferrer"
        style={{ width: '110px', height: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ede9fe', border: '2px solid #c4b5fd', borderRadius: '12px', textDecoration: 'none', gap: '6px', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', padding: '8px' }}>
        <BiLinkExternal size={24} />
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
        style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e0e7ff', boxShadow: '0 4px 14px rgba(99,102,241,0.15)', display: 'block', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
    </a>
  );
};

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────
const TicketDetailModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const priorityConfig = {
    HIGH:   { bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', emoji: '🔴' },
    MEDIUM: { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', emoji: '🔵' },
    LOW:    { bg: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', emoji: '🟣' },
  };

  const statusMap = {
    OPEN:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
    IN_PROGRESS: { bg: '#fef3c7', color: '#d97706', label: 'In Progress' },
    RESOLVED:    { bg: '#d1fae5', color: '#059669', label: 'Resolved' },
    CLOSED:      { bg: '#f3f4f6', color: '#6b7280', label: 'Closed' },
    REJECTED:    { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  };

  const pConf = priorityConfig[ticket.priority] || priorityConfig.LOW;
  const sConf = statusMap[ticket.status] || statusMap.OPEN;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>

          {/* Header */}
          <div style={{ background: pConf.bg, padding: '24px 28px 20px' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1 me-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.35)' }}>
                    {pConf.emoji} {ticket.priority} PRIORITY
                  </span>
                  <span style={{ background: sConf.bg, color: sConf.color, fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>
                    {sConf.label}
                  </span>
                </div>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                  {ticket.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', margin: '4px 0 0', fontWeight: 600 }}>
                  Ticket #{ticket.id?.slice(-8)}
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <BiX size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ background: '#f8faff', padding: '24px', overflowY: 'auto', maxHeight: '60vh' }}>

            {/* Description */}
            <section className="mb-4">
              <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: '8px' }}>Description</p>
              <div style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderRadius: '12px', padding: '14px', color: '#374151', fontWeight: 500, lineHeight: 1.7, fontSize: '0.88rem' }}>
                {ticket.description || 'No description provided.'}
              </div>
            </section>

            {/* Meta */}
            <div className="row g-3 mb-4">
              {[
                { label: 'Category', value: ticket.category, icon: <BiFilter />, color: '#0ea5e9', bg: '#e0f2fe' },
                { label: 'Location', value: ticket.resourceName || ticket.location || 'N/A', icon: <BiMap />, color: '#6366f1', bg: '#ede9fe' },
                { label: 'Assigned To', value: ticket.technicianName || 'Unassigned', icon: <BiWrench />, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Reported', value: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A', icon: <BiCalendar />, color: '#10b981', bg: '#d1fae5' },
              ].map(item => (
                <div key={item.label} className="col-6">
                  <div style={{ background: '#fff', border: '1.5px solid #e8eeff', borderRadius: '12px', padding: '12px' }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div style={{ background: item.bg, color: item.color, borderRadius: '6px', padding: '3px 5px', display: 'flex', fontSize: '0.9rem' }}>{item.icon}</div>
                      <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.83rem' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution Notes */}
            {ticket.resolutionNotes && (
              <section className="mb-4">
                <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>Resolution Notes</p>
                <div style={{ background: '#d1fae5', border: '1.5px solid #6ee7b7', borderRadius: '12px', padding: '14px', color: '#065f46', fontWeight: 500, fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {ticket.resolutionNotes}
                </div>
              </section>
            )}

            {/* Rejection Reason */}
            {ticket.rejectionReason && (
              <section className="mb-4">
                <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', color: '#dc2626', textTransform: 'uppercase', marginBottom: '8px' }}>Rejection Reason</p>
                <div style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '14px', color: '#991b1b', fontWeight: 500, fontSize: '0.88rem' }}>
                  {ticket.rejectionReason}
                </div>
              </section>
            )}

            {/* Attachments */}
            {ticket.attachmentUrls?.length > 0 && (
              <section>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BiPaperclip /> Attachments ({ticket.attachmentUrls.length})
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {ticket.attachmentUrls.map((url, i) => (
                    <AttachmentTile key={i} url={url} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div style={{ background: '#fff', borderTop: '1.5px solid #e8eeff', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 28px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/tickets/my');
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load tickets', err);
      toast.error('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const filtered = tickets.filter(t => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ||
                        t.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || t.status === filter;
    return matchSearch && matchFilter;
  });

  const priorityColor = (p) => ({ HIGH: '#ef4444', MEDIUM: '#3b82f6', LOW: '#8b5cf6' }[p] || '#64748b');
  const priorityBg   = (p) => ({ HIGH: '#fee2e2', MEDIUM: '#dbeafe', LOW: '#ede9fe' }[p] || '#f1f5f9');

  const statusConf = {
    OPEN:        { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Open' },
    IN_PROGRESS: { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b', label: 'In Progress' },
    RESOLVED:    { bg: '#d1fae5', color: '#065f46', dot: '#10b981', label: 'Resolved' },
    CLOSED:      { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', label: 'Closed' },
    REJECTED:    { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Rejected' },
  };

  const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  return (
    <div className="d-flex bg-light min-vh-100 overflow-hidden">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ marginLeft: '260px' }}>
        <Topbar notificationCount={0} />

        <main className="p-4 p-lg-5">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h1 className="h2 fw-bold mb-2" style={{ color: '#0f172a' }}>
                My <span style={{ color: '#6366f1' }}>Tickets</span>
              </h1>
              <p style={{ color: '#64748b', fontWeight: 500, margin: 0 }}>
                {tickets.length} total incident report{tickets.length !== 1 ? 's' : ''} submitted
              </p>
            </div>
            <div className="d-flex gap-2">
              <button onClick={fetchTickets}
                style={{ background: '#fff', border: '1.5px solid #e0e7ff', color: '#6366f1', borderRadius: '50px', padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BiRefresh size={18} /> Refresh
              </button>
              <button onClick={() => navigate('/dashboard/user/report-incident')}
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 22px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                + New Ticket
              </button>
            </div>
          </motion.div>

          {/* Search + Filter Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px' }}>
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div style={{ position: 'relative' }}>
                  <BiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
                  <input type="text" placeholder="Search by title or category…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px', border: '1.5px solid #e0e7ff', borderRadius: '10px', fontSize: '0.88rem', color: '#1e293b', outline: 'none', fontWeight: 500 }} />
                </div>
              </div>
              <div className="col-md-7">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      style={{
                        background: filter === f ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f8faff',
                        color: filter === f ? '#fff' : '#64748b',
                        border: filter === f ? 'none' : '1.5px solid #e0e7ff',
                        borderRadius: '50px',
                        padding: '5px 16px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        letterSpacing: '0.03em',
                        boxShadow: filter === f ? '0 4px 10px rgba(99,102,241,0.25)' : 'none',
                      }}>
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ticket List */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#6366f1' }} role="status" />
              <p style={{ color: '#64748b', marginTop: '12px', fontWeight: 600 }}>Loading your tickets…</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ background: '#ede9fe', borderRadius: '50%', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <BiWrench size={32} style={{ color: '#6366f1' }} />
              </div>
              <h3 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px' }}>No tickets found</h3>
              <p style={{ color: '#94a3b8', fontWeight: 500 }}>
                {search || filter !== 'ALL' ? 'Try adjusting your search or filter.' : 'You haven\'t submitted any incident reports yet.'}
              </p>
              <button onClick={() => navigate('/dashboard/user/report-incident')}
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: '50px', padding: '10px 28px', fontWeight: 700, cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                Report an Incident
              </button>
            </motion.div>
          ) : (
            <div className="row g-4">
              <AnimatePresence>
                {filtered.map((ticket, index) => {
                  const sc = statusConf[ticket.status] || statusConf.OPEN;
                  return (
                    <motion.div key={ticket.id} className="col-12 col-md-6 col-xl-4"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.04 }}>
                      <div
                        onClick={() => setSelectedTicket(ticket)}
                        style={{ background: '#fff', border: '1.5px solid #e0e7ff', borderRadius: '18px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {/* Card Top Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ background: priorityBg(ticket.priority), color: priorityColor(ticket.priority), borderRadius: '8px', padding: '6px 8px', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                            <BiErrorCircle />
                          </div>
                          <span style={{ background: sc.bg, color: sc.color, fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '50px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                            {sc.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '6px', lineHeight: 1.4 }}>
                          {ticket.title}
                        </h4>

                        {/* Category + Priority */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '50px', padding: '2px 10px' }}>
                            {ticket.category}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: priorityColor(ticket.priority), background: priorityBg(ticket.priority), borderRadius: '50px', padding: '2px 10px' }}>
                            {ticket.priority}
                          </span>
                        </div>

                        {/* Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                          <BiMap style={{ color: '#6366f1', flexShrink: 0 }} />
                          {ticket.resourceName || ticket.location || 'No location specified'}
                        </div>

                        {/* Assigned */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                          <BiWrench style={{ color: ticket.technicianName !== 'Unassigned' ? '#10b981' : '#94a3b8', flexShrink: 0 }} />
                          {ticket.technicianName !== 'Unassigned'
                            ? <span style={{ color: '#10b981', fontWeight: 700 }}>{ticket.technicianName}</span>
                            : <span style={{ color: '#94a3b8' }}>Awaiting assignment</span>}
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1.5px solid #e8eeff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <BiTime size={14} />
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {ticket.attachmentUrls?.length > 0 && (
                              <span style={{ color: '#6366f1', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                                <BiPaperclip size={14} /> {ticket.attachmentUrls.length}
                              </span>
                            )}
                            <span style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              View Details <BiChevronRight />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        )}
      </AnimatePresence>

      <style>{`
        .bg-light { background-color: #f8faff !important; }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default MyTickets;
