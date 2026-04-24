import React from 'react';
import { motion } from 'framer-motion';
import { 
  BiUser, 
  BiShieldQuarter, 
  BiCheckCircle, 
  BiXCircle,
  BiCalendar,
  BiEnvelope
} from 'react-icons/bi';

const UserTable = ({ users, onUpdateStatus }) => {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10';
      case 'TECHNICIAN': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10';
      default: return 'badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10';
    }
  };

  return (
    <div className="glass-card overflow-hidden border border-white shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="ps-4 py-3 text-slate-800 small fw-bold text-uppercase">User Detail</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Role Management</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Joined Date</th>
              <th className="py-3 text-slate-800 small fw-bold text-uppercase">Account Status</th>
              <th className="pe-4 py-3 text-slate-800 small fw-bold text-uppercase text-end">Direct Action</th>
            </tr>
          </thead>
          <tbody className="border-0">
            {users.length > 0 ? users.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-bottom border-light hover-bg-light"
              >
                <td className="ps-4 py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                      <BiUser size={20} />
                    </div>
                    <div>
                      <div className="fw-bold text-slate-900 small">{user.name}</div>
                      <div className="text-slate-500 x-small d-flex align-items-center gap-1">
                        <BiEnvelope size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <select 
                      className={`form-select form-select-sm border-light shadow-none fw-bold ${getRoleBadge(user.role)}`}
                      style={{ width: '130px', fontSize: '0.7rem' }}
                      value={user.role}
                      onChange={(e) => onUpdateStatus(user.id, null, e.target.value)}
                    >
                      <option value="USER">STUDENT / USER</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="ADMIN">ADMINISTRATOR</option>
                    </select>
                    {user.role === 'ADMIN' && <BiShieldQuarter size={16} className="text-danger opacity-75" title="Privileged Account" />}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2 text-slate-600 small fw-medium">
                    <BiCalendar className="text-primary opacity-50" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  {user.active ? (
                    <span className="badge bg-success bg-opacity-10 text-success d-inline-flex align-items-center gap-1 px-3 py-1 border border-success border-opacity-10 rounded-pill" style={{ fontSize: '0.65rem' }}>
                      <BiCheckCircle /> ACTIVE
                    </span>
                  ) : (
                    <span className="badge bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center gap-1 px-3 py-1 border border-danger border-opacity-10 rounded-pill" style={{ fontSize: '0.65rem' }}>
                      <BiXCircle /> INACTIVE
                    </span>
                  )}
                </td>
                <td className="pe-4 text-end">
                  <button 
                    onClick={() => onUpdateStatus(user.id, !user.active, null)}
                    className={`btn btn-sm rounded-pill px-3 fw-bold shadow-sm ${user.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {user.active ? 'Deactivate User' : 'Activate User'}
                  </button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="text-slate-400">
                    <BiUser size={48} className="mb-3 opacity-25" />
                    <p className="mb-0 small fw-medium">No users match your criteria.</p>
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
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .x-small { font-size: 0.72rem; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .form-select-sm { padding: 0.25rem 2rem 0.25rem 0.75rem; }
      `}</style>
    </div>
  );
};

export default UserTable;
