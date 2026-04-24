import React, { useState } from 'react';
import { BiCheckCircle, BiWrench, BiEditAlt } from 'react-icons/bi';

// Format the resolution fields into a single readable string for storage
const formatNotes = (data) => {
  const parts = [];
  if (data.summary)      parts.push(`Summary: ${data.summary}`);
  if (data.actionsTaken) parts.push(`Actions Taken: ${data.actionsTaken}`);
  if (data.partsUsed)    parts.push(`Parts / Replacements: ${data.partsUsed}`);
  return parts.join('\n\n');
};

const ResolutionNotesPanel = ({ ticketId, currentStatus, onSave, onResolve }) => {
  const [resolutionData, setResolutionData] = useState({
    summary: '',
    actionsTaken: '',
    partsUsed: '',
  });
  const [isEditing, setIsEditing] = useState(true);

  const handleSaveProgress = (e) => {
    e.preventDefault();
    const formattedNotes = formatNotes(resolutionData);
    // Save notes while keeping the ticket in its current status (or update to IN_PROGRESS)
    onSave(ticketId, formattedNotes, false);
    setIsEditing(false);
  };

  const handleResolve = () => {
    const formattedNotes = formatNotes(resolutionData);
    // Save notes AND mark as resolved in one call
    onSave(ticketId, formattedNotes, true);
    setIsEditing(false);
  };

  const inputStyle = {
    background: '#fff',
    border: '1.5px solid #c7d2fe',
    borderRadius: '10px',
    color: '#1e3a8a',
    fontSize: '0.88rem',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontWeight: 500,
    boxShadow: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '0.6rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#6366f1',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f4ff 100%)',
      border: '1.5px solid #c7d2fe',
      borderRadius: '16px',
      padding: '20px',
    }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#3730a3', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px', padding: '4px 8px', fontSize: '1rem', display: 'flex' }}>
            <BiWrench />
          </span>
          Resolution Details
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '50px', padding: '5px 14px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <BiEditAlt /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveProgress}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Resolution Summary *</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g., Repaired faulty wiring in the control box"
              required
              value={resolutionData.summary}
              onChange={(e) => setResolutionData({ ...resolutionData, summary: e.target.value })}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#c7d2fe'}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Actions Taken</label>
            <textarea
              style={{ ...inputStyle, resize: 'none' }}
              rows="3"
              placeholder="Detail the steps performed to resolve this issue..."
              value={resolutionData.actionsTaken}
              onChange={(e) => setResolutionData({ ...resolutionData, actionsTaken: e.target.value })}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#c7d2fe'}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Parts / Replacements Used (Optional)</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="List any parts or equipment used..."
              value={resolutionData.partsUsed}
              onChange={(e) => setResolutionData({ ...resolutionData, partsUsed: e.target.value })}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#c7d2fe'}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                background: '#fff',
                border: '1.5px solid #6366f1',
                color: '#4f46e5',
                borderRadius: '50px',
                padding: '8px 22px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Save Notes
            </button>
            <button
              type="button"
              disabled={!resolutionData.summary.trim()}
              onClick={handleResolve}
              style={{
                background: resolutionData.summary.trim()
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : '#d1fae5',
                color: resolutionData.summary.trim() ? '#fff' : '#6ee7b7',
                border: 'none',
                borderRadius: '50px',
                padding: '8px 22px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: resolutionData.summary.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: resolutionData.summary.trim() ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              <BiCheckCircle size={16} /> Mark as Resolved
            </button>
          </div>
        </form>
      ) : (
        <div>
          {[
            { label: 'Summary', value: resolutionData.summary },
            { label: 'Actions Taken', value: resolutionData.actionsTaken || 'Not specified' },
            ...(resolutionData.partsUsed ? [{ label: 'Parts Used', value: resolutionData.partsUsed }] : []),
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <span style={labelStyle}>{item.label}</span>
              <p style={{ margin: 0, color: '#1e3a8a', fontWeight: 600, fontSize: '0.88rem', background: '#fff', border: '1.5px solid #e0e7ff', borderRadius: '10px', padding: '10px 14px', whiteSpace: 'pre-wrap' }}>
                {item.value}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid #c7d2fe' }}>
            {currentStatus !== 'RESOLVED' ? (
              <button
                onClick={handleResolve}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '10px 0',
                  width: '100%',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                <BiCheckCircle size={18} /> Confirm Resolution & Close Ticket
              </button>
            ) : (
              <div style={{ background: '#d1fae5', border: '1.5px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', color: '#065f46', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BiCheckCircle size={18} /> Resolved — Ticket Closed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolutionNotesPanel;
