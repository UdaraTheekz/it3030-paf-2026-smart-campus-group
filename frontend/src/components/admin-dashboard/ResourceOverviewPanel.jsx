import React from 'react';
import { motion } from 'framer-motion';
import { BiBuilding, BiPlus, BiDotsHorizontalRounded, BiCheckCircle, BiBlock } from 'react-icons/bi';

const ResourceOverviewPanel = ({ resources = [], onStatusUpdate, onEdit }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'badge bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'MAINTENANCE': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'OCCUPIED': return 'badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
      case 'OUT_OF_SERVICE': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
  };

  return (
    <div className="glass-card p-4 border border-white h-100 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
        <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2 text-slate-900">
          <div className="p-1 rounded bg-info bg-opacity-10 text-info">
            <BiBuilding size={18} />
          </div>
          Campus Resource Catalogue
        </h3>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-1 fw-bold rounded-pill shadow-sm" style={{ fontSize: '0.7rem' }}>
          <BiPlus size={16} /> ADD RESOURCE
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-borderless align-middle mb-0">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide ps-3" style={{ fontSize: '0.65rem' }}>Resource Name</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Type</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Location</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Status</th>
              <th className="fw-bold text-slate-800 text-uppercase ls-wide text-end pe-3" style={{ fontSize: '0.65rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.85rem' }}>
            {resources.length > 0 ? resources.map((res, index) => (
              <motion.tr 
                key={res.id || index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-3">
                  <div className="fw-bold text-slate-900">{res.name}</div>
                  <div className="text-slate-400 small fw-medium" style={{ fontSize: '0.7rem' }}>CAP: {res.capacity || 'N/A'} Persons</div>
                </td>
                <td className="text-slate-600">{res.type}</td>
                <td className="text-slate-500 small">{res.location}</td>
                <td>
                  <span className={getStatusBadge(res.status)}>
                    {res.status}
                  </span>
                </td>
                <td className="text-end pe-3">
                  <div className="dropdown position-static">
                    <button className="btn btn-white btn-icon-sm border-light text-slate-400 shadow-sm rounded-circle" data-bs-toggle="dropdown">
                      <BiDotsHorizontalRounded size={20} />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-light bg-white p-2 mt-2">
                      <li>
                        <button className="dropdown-item rounded-2 text-slate-700 small py-2 d-flex align-items-center gap-2 fw-medium" onClick={() => onEdit(res)}>
                          Edit Resource
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item rounded-2 text-warning small py-2 d-flex align-items-center gap-2 fw-medium" onClick={() => onStatusUpdate(res.id, 'MAINTENANCE')}>
                          Mark for Maintenance
                        </button>
                      </li>
                      <li><hr className="dropdown-divider border-light" /></li>
                      <li>
                        {res.status === 'OUT_OF_SERVICE' ? (
                          <button className="dropdown-item rounded-2 text-success small py-2 d-flex align-items-center gap-2 fw-bold" onClick={() => onStatusUpdate(res.id, 'AVAILABLE')}>
                            <BiCheckCircle /> Activate
                          </button>
                        ) : (
                          <button className="dropdown-item rounded-2 text-danger small py-2 d-flex align-items-center gap-2 fw-bold" onClick={() => onStatusUpdate(res.id, 'OUT_OF_SERVICE')}>
                            <BiBlock /> Deactivate
                          </button>
                        )}
                      </li>
                    </ul>
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-slate-400 small italic">No resources defined in the catalogue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .btn-white { background: #fff; }
        .btn-icon-sm { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; padding: 0; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .ls-wide { letter-spacing: 0.05em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .italic { font-style: italic; }
        .dropdown-item:hover { background-color: #f1f5f9 !important; color: #0f172a !important; transition: all 0.2s; }
      `}</style>
    </div>
  );
};

export default ResourceOverviewPanel;
