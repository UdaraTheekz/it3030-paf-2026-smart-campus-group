import React from 'react';
import { motion } from 'framer-motion';
import { 
  BiShow, 
  BiEdit, 
  BiTrash, 
  BiSearch, 
  BiFilterAlt,
  BiCheckCircle,
  BiXCircle
} from 'react-icons/bi';

const ResourceTable = ({ resources, onView, onEdit, onDelete }) => {
  return (
    <div className="glass-card overflow-hidden border border-white shadow-sm">
      <div className="p-4 border-bottom border-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 bg-white bg-opacity-50">
        <h4 className="h5 fw-bold text-slate-900 mb-0">Campus Assets Catalogue</h4>
        <div className="d-flex gap-2 w-100 w-sm-auto">
          <div className="input-group input-group-sm" style={{ maxWidth: '250px' }}>
            <span className="input-group-text bg-light border-light text-muted">
              <BiSearch />
            </span>
            <input 
              type="text" 
              className="form-control bg-light text-slate-800 border-light shadow-none" 
              placeholder="Search assets..." 
            />
          </div>
          <button className="btn btn-sm btn-white border-light text-slate-600 d-flex align-items-center gap-2 shadow-sm">
            <BiFilterAlt /> Filter
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="ps-4 py-3 text-slate-800 small fw-bold text-uppercase">Asset ID</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Resource Name</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Type</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Location</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Status</th>
              <th className="pe-4 py-3 text-slate-800 small fw-bold text-uppercase text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="border-0">
            {resources.map((resource, index) => (
              <motion.tr 
                key={resource.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-4">
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1 small">
                    {resource.resourceCode}
                  </span>
                </td>
                <td className="fw-bold text-slate-900 small">{resource.resourceName}</td>
                <td>
                  <span className="text-slate-600 small">
                    {resource.resourceType.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div className="text-slate-600 small">
                    {resource.building} {resource.floor ? `• FL ${resource.floor}` : ''}
                    {resource.roomNumber ? ` • RM ${resource.roomNumber}` : ''}
                  </div>
                </td>
                <td>
                  {resource.status === 'ACTIVE' ? (
                    <span className="badge bg-success bg-opacity-10 text-success d-inline-flex align-items-center gap-1 px-2 py-1 border border-success border-opacity-10">
                      <BiCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="badge bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center gap-1 px-2 py-1 border border-danger border-opacity-10">
                      <BiXCircle /> Out of Service
                    </span>
                  )}
                </td>
                <td className="pe-4 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onView(resource)}
                      className="btn btn-sm btn-icon btn-light text-primary border-light shadow-sm" 
                      title="View Details"
                    >
                      <BiShow />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(resource)}
                      className="btn btn-sm btn-icon btn-light text-warning border-light shadow-sm"
                      title="Edit Asset"
                    >
                      <BiEdit />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(resource)}
                      className="btn btn-sm btn-icon btn-light text-danger border-light shadow-sm"
                      title="Delete Asset"
                    >
                      <BiTrash />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="text-slate-400">
                    <BiFilterAlt size={48} className="mb-3 opacity-25" />
                    <p className="mb-0 small fw-medium">No campus assets found in the catalogue.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
        .hover-bg-light:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

export default ResourceTable;
