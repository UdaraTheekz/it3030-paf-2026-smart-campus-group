import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiBuildings, 
  BiArrowBack,
  BiPlus,
  BiLoaderAlt,
  BiErrorCircle,
  BiTrashAlt
} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import ResourceTable from '../components/admin-dashboard/ResourceTable';
import ResourceModal from '../components/admin-dashboard/ResourceModal';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

import AdminLayout from '../components/admin-dashboard/AdminLayout';

const ManageResources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/resources');
      setResources(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assets. Please check backend connection.");
      toast.error("Error loading catalogue");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (resource) => {
    setSelectedResource(resource);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedResource(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (resource) => {
    setSelectedResource(resource);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    
    try {
      await axiosInstance.delete(`/resources/${selectedResource.id}`);
      toast.success("Asset removed from catalogue");
      setResources(resources.filter(r => r.id !== selectedResource.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete asset");
    }
  };

  const handleResourceChange = (changedResource) => {
    setResources(prev => {
      const exists = prev.find(r => r.id === changedResource.id);
      if (exists) {
        return prev.map(r => r.id === changedResource.id ? changedResource : r);
      }
      return [changedResource, ...prev];
    });
  };

  return (
    <AdminLayout>
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5"
      >
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/admin')}
            className="btn btn-icon btn-white shadow-sm border border-light text-slate-600 rounded-circle p-2"
          >
            <BiArrowBack size={20} />
          </button>
          <div>
            <h2 className="display-6 fw-bold text-slate-900 mb-1">
              Asset <span className="gradient-text">Catalogue</span>
            </h2>
            <p className="text-slate-500 mb-0">Unified campus facilities and equipment management interface</p>
          </div>
        </div>
        
        <button 
          onClick={handleCreate}
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-lg"
        >
          <BiPlus size={20} /> Register New Asset
        </button>
      </motion.div>

      {/* Stats/Summary Row */}
      <div className="row g-4 mb-5">
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 border border-white text-center">
            <h5 className="text-slate-500 small text-uppercase fw-bold mb-1">Total Assets</h5>
            <div className="h3 fw-bold text-slate-900 mb-0">{resources.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 border border-white text-center">
            <h5 className="text-slate-500 small text-uppercase fw-bold mb-1">Active</h5>
            <div className="h3 fw-bold text-success mb-0">
              {resources.filter(r => r.status === 'ACTIVE').length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-5 text-center"
          >
            <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-slate-500">Synchronizing with central hub...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-5 text-center border-danger border-opacity-10"
          >
            <BiErrorCircle size={48} className="text-danger mb-3" />
            <h4 className="text-slate-900 fw-bold">{error}</h4>
            <button onClick={fetchResources} className="btn btn-outline-primary mt-3 px-4">Retry Sync</button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ResourceTable 
              resources={resources}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <ResourceModal 
            isOpen={isModalOpen}
            resource={selectedResource}
            mode={modalMode}
            onClose={() => setIsModalOpen(false)}
            onUpdate={handleResourceChange}
          />
        )}
        
        {isDeleteModalOpen && (
          <div className="modal-overlay d-flex align-items-center justify-content-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card bg-white p-4 border-0 shadow-2xl"
              style={{ width: '95%', maxWidth: '400px' }}
            >
              <div className="text-center mb-4">
                <div className="p-3 bg-danger bg-opacity-10 rounded-circle d-inline-block mb-3">
                  <BiTrashAlt size={32} className="text-danger" />
                </div>
                <h4 className="text-slate-900 fw-bold">Delete Asset?</h4>
                <p className="text-slate-500 small">
                  Are you sure you want to permanently remove <strong>{selectedResource?.resourceName}</strong> from the campus catalogue?
                </p>
              </div>
              <div className="d-flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-light flex-grow-1 text-slate-700">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn btn-danger flex-grow-1 fw-bold">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-700 { color: #334155; }
        .text-slate-500 { color: #64748b; }
        .text-slate-600 { color: #475569; }
        .btn-white { background: #fff; border: 1px solid #e2e8f0; }
        .btn-white:hover { background: #f8fafc; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1060;
        }
      `}</style>
    </AdminLayout>
  );
};

export default ManageResources;
