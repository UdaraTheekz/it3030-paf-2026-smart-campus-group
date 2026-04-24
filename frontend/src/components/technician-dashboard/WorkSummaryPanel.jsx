import React from 'react';
import { BiBarChartAlt2, BiCheckCircle, BiWrench, BiTimer } from 'react-icons/bi';

const MetricItem = ({ icon, label, value, progress, color }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div className="d-flex align-items-center gap-2">
         {React.cloneElement(icon, { size: 18, className: `text-${color}` })}
         <span className="text-slate-500 small fw-bold">{label}</span>
      </div>
      <span className="text-slate-900 small fw-extrabold">{value}</span>
    </div>
    <div className="progress bg-light shadow-inner" style={{ height: '8px', borderRadius: '4px' }}>
      <div 
        className={`progress-bar bg-${color} shadow-sm`} 
        role="progressbar" 
        style={{ width: `${progress}%`, borderRadius: '4px' }}
      ></div>
    </div>
  </div>
);

const WorkSummaryPanel = () => {
  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <h3 className="h6 fw-bold mb-4 d-flex align-items-center gap-2 text-slate-900">
        <div className="p-1 rounded bg-info bg-opacity-10 text-info">
          <BiBarChartAlt2 size={18} />
        </div>
        Performance Summary
      </h3>

      <div className="mt-2">
        <MetricItem 
          icon={<BiCheckCircle />} 
          label="Weekly Resolution" 
          value="12 / 15" 
          progress={80} 
          color="success" 
        />
        <MetricItem 
          icon={<BiWrench />} 
          label="Live Taskload" 
          value="3 Tasks" 
          progress={40} 
          color="warning" 
        />
        <MetricItem 
          icon={<BiTimer />} 
          label="Response Velocity" 
          value="45m avg" 
          progress={90} 
          color="info" 
        />
        
        <div className="mt-5 p-3 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10 shadow-sm">
          <p className="small text-slate-500 mb-1 fw-bold text-uppercase ls-wide" style={{ fontSize: '0.6rem' }}>Performance Rating</p>
          <div className="d-flex align-items-center gap-2">
            <h4 className="h3 fw-bold text-slate-900 mb-0">4.9</h4>
            <div className="d-flex text-warning">
              {Array(5).fill(0).map((_, i) => <span key={i} className="small">★</span>)}
            </div>
          </div>
          <p className="text-slate-400 fw-medium mb-0 mt-1" style={{ fontSize: '0.65rem' }}>Top 5% Tier System-Wide</p>
        </div>
      </div>
      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
        .ls-wide { letter-spacing: 0.1em; }
        .fw-extrabold { font-weight: 800; }
      `}</style>
    </div>
  );
};

export default WorkSummaryPanel;
