import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BiUserCircle, 
  BiSearch, 
  BiFilterAlt,
  BiLoaderAlt,
  BiRefresh
} from 'react-icons/bi';
import AdminLayout from '../components/admin-dashboard/AdminLayout';
import UserTable from '../components/admin-dashboard/UserTable';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = users;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
    }

    if (selectedRole !== 'ALL') {
      result = result.filter(u => u.role === selectedRole);
    }

    if (selectedStatus !== 'ALL') {
      result = result.filter(u => (selectedStatus === 'ACTIVE') ? u.active : !u.active);
    }

    setFilteredUsers(result);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const handleUpdateUserStatus = async (id, active, role) => {
    try {
      let params = [];
      if (active !== null) params.push(`active=${active}`);
      if (role !== null) params.push(`role=${role}`);
      
      const query = params.length > 0 ? `?${params.join('&')}` : '';
      await axiosInstance.patch(`/users/${id}/status${query}`);
      
      toast.success("User updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div>
            <h2 className="display-6 fw-bold text-slate-900 mb-2">
              User <span className="gradient-text">Management</span>
            </h2>
            <p className="text-slate-500 mb-0">Oversee campus directory, manage roles and account privileges</p>
          </div>
          <button onClick={fetchUsers} className="btn btn-white border-light text-slate-600 shadow-sm d-flex align-items-center gap-2 px-4 rounded-pill">
            <BiRefresh size={20} /> Refresh Directory
          </button>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="glass-card p-4 mb-4 border border-white shadow-sm">
        <div className="row g-3">
          <div className="col-12 col-xl-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-light text-slate-400">
                <BiSearch size={20} />
              </span>
              <input 
                type="text" 
                className="form-control bg-light border-light shadow-none py-2 text-slate-700 fw-medium"
                placeholder="Search by name or email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-xl-7">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="d-flex align-items-center gap-2">
                <BiFilterAlt className="text-primary" />
                <span className="small fw-bold text-slate-600">Role:</span>
                <select 
                  className="form-select form-select-sm border-light bg-light rounded-pill px-3 shadow-none fw-medium text-slate-700"
                  style={{ width: '140px' }}
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">Student / User</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold text-slate-600">Status:</span>
                <select 
                  className="form-select form-select-sm border-light bg-light rounded-pill px-3 shadow-none fw-medium text-slate-700"
                  style={{ width: '130px' }}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="ALL">All States</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>
              </div>
              <div className="ms-auto text-slate-400 small fw-medium">
                Total Directives: <span className="text-primary">{filteredUsers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-5 text-center">
          <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-slate-500 fw-medium">Accessing user directory...</p>
        </div>
      ) : (
        <UserTable users={filteredUsers} onUpdateStatus={handleUpdateUserStatus} />
      )}

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
      `}</style>
    </AdminLayout>
  );
};

export default ManageUsers;
