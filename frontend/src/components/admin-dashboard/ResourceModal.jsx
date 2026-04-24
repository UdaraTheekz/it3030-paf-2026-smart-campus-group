import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiBuildings, 
  BiCategory, 
  BiInfoCircle, 
  BiMap, 
  BiGroup, 
  BiTime, 
  BiCloudUpload, 
  BiCheckCircle, 
  BiX,
  BiLoaderAlt,
  BiSave,
  BiShow,
  BiEdit
} from 'react-icons/bi';
import MediaUpload from '../../utils/MediaUpload';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const RESOURCE_TYPES = [
  "LECTURE_HALL", "COMPUTER_LAB", "MEETING_ROOM", "AUDITORIUM",
  "SEMINAR_HALL", "SPORTS_GROUND", "CONFERENCE_ROOM", "LIBRARY_ROOM",
  "PROJECTOR", "CAMERA_EQUIPMENT", "SOUND_SYSTEM", "LABORATORY_EQUIPMENT"
];

const ResourceModal = ({ resource, mode, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    description: '',
    building: '',
    floor: '',
    roomNumber: '',
    capacity: '',
    status: 'ACTIVE',
    imageUrl: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        setFormData({
          resourceName: '',
          resourceType: 'LECTURE_HALL',
          description: '',
          building: '',
          floor: '',
          roomNumber: '',
          capacity: '',
          status: 'ACTIVE',
          imageUrl: ''
        });
      } else if (resource) {
        setFormData({
          resourceName: resource.resourceName || '',
          resourceType: resource.resourceType || '',
          description: resource.description || '',
          building: resource.building || '',
          floor: resource.floor || '',
          roomNumber: resource.roomNumber || '',
          capacity: resource.capacity || '',
          status: resource.status || 'ACTIVE',
          imageUrl: resource.imageUrl || ''
        });
      }
      setErrors({});
    }
  }, [resource, mode, isOpen]);

  const isFixedResource = (type) => {
    return ["LECTURE_HALL", "COMPUTER_LAB", "MEETING_ROOM", "AUDITORIUM", "SEMINAR_HALL", "SPORTS_GROUND", "CONFERENCE_ROOM", "LIBRARY_ROOM"].includes(type);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.resourceName.trim()) newErrors.resourceName = "Proper asset name is required";
    if (!formData.resourceType) newErrors.resourceType = "Please select a category";
    if (isFixedResource(formData.resourceType) && !formData.building.trim()) {
      newErrors.building = "Building location is mandatory for this type";
    }
    const capacityVal = parseInt(formData.capacity);
    if (!formData.capacity || isNaN(capacityVal) || capacityVal <= 0) {
      newErrors.capacity = "Must be a valid positive number";
    }
    if (!formData.imageUrl) newErrors.imageUrl = "Asset image is required for the catalogue";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the errors in the form before submitting.");
      return false;
    }
    return true;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await MediaUpload(file);
        setFormData({ ...formData, imageUrl: url });
        toast.success("Image updated successfully!");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'view') return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submissionData = { ...formData };
      if (!isFixedResource(formData.resourceType)) {
        submissionData.building = "";
        submissionData.floor = "";
        submissionData.roomNumber = "";
      }

      let response;
      if (mode === 'create') {
        response = await axiosInstance.post('/resources', {
          ...submissionData,
          capacity: parseInt(formData.capacity)
        });
        toast.success("Resource registered successfully!");
      } else {
        response = await axiosInstance.put(`/resources/${resource.id}`, {
          ...submissionData,
          capacity: parseInt(formData.capacity)
        });
        toast.success("Resource updated successfully!");
      }
      
      onUpdate(response.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error processing resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay d-flex align-items-center justify-content-center p-3">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card bg-white border-white shadow-2xl overflow-hidden"
        style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 border-bottom border-light d-flex justify-content-between align-items-center bg-light bg-opacity-50">
          <div className="d-flex align-items-center gap-2">
            <div className={`p-2 rounded-3 bg-opacity-10 ${mode === 'view' ? 'bg-primary text-primary' : mode === 'create' ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
              {mode === 'view' ? <BiShow size={20} /> : mode === 'create' ? <BiBuildings size={20} /> : <BiEdit size={20} />}
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-slate-900">
                {mode === 'view' ? 'Asset Details' : mode === 'create' ? 'Register New Campus Asset' : 'Edit Asset Configuration'}
              </h5>
              <p className="small text-muted mb-0">{mode === 'create' ? 'Catalogue Entry' : resource?.resourceCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close shadow-none"></button>
        </div>

        <div className="modal-body overflow-auto p-0" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-lg-5 p-4 bg-light bg-opacity-30 border-end border-light">
              <div className="position-relative mb-4">
                <img 
                  src={formData.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt="Resource" 
                  className="img-fluid rounded-4 shadow-md border border-white"
                  style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                />
                
                {(mode === 'edit' || mode === 'create') && (
                  <div className="mt-3">
                    <label className={`btn btn-white btn-sm w-100 border-light text-slate-600 d-flex align-items-center justify-content-center gap-2 shadow-sm ${errors.imageUrl ? 'border-danger' : ''}`}>
                      <BiCloudUpload size={18} />
                      {isUploading ? 'Uploading...' : 'Upload Asset Image'}
                      <input type="file" hidden onChange={handleImageChange} accept="image/*" disabled={isUploading} />
                    </label>
                    {errors.imageUrl && <div className="text-danger x-small fw-bold mt-1 text-center">{errors.imageUrl}</div>}
                  </div>
                )}

                {isUploading && (
                  <div className="position-absolute inset-0 bg-white bg-opacity-50 rounded-4 d-flex align-items-center justify-content-center">
                    <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary" />
                  </div>
                )}
              </div>

              <div className="glass-card bg-white p-3 border-light shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small text-slate-500 fw-bold text-uppercase">Asset ID</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">{mode === 'create' ? 'PENDING' : resource?.resourceCode}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small text-slate-500 fw-bold text-uppercase">Type</span>
                  <span className="text-slate-800 small fw-bold">{formData.resourceType.replace(/_/g, ' ')}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-slate-500 fw-bold text-uppercase">Capacity</span>
                  <span className="text-slate-800 small fw-bold">{formData.capacity} Units</span>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="col-lg-7 p-4 bg-white">
              <form id="resource-modal-form" onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label text-slate-600 small fw-bold">Resource Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light text-muted"><BiInfoCircle /></span>
                    <input 
                      type="text" 
                      disabled={mode === 'view'}
                      className={`form-control bg-light border-light text-slate-800 shadow-none px-3 ${errors.resourceName ? 'is-invalid' : ''}`} 
                      value={formData.resourceName}
                      onChange={(e) => setFormData({...formData, resourceName: e.target.value})}
                      required
                    />
                  </div>
                  {errors.resourceName && <div className="text-danger x-small fw-bold mt-1 ps-1">{errors.resourceName}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-slate-600 small fw-bold">Resource Type</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light text-muted"><BiCategory /></span>
                    <select 
                      disabled={mode === 'view'}
                      className={`form-select bg-light border-light text-slate-800 shadow-none ${errors.resourceType ? 'is-invalid' : ''}`}
                      value={formData.resourceType}
                      onChange={(e) => setFormData({...formData, resourceType: e.target.value})}
                    >
                      {RESOURCE_TYPES.map(type => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  {errors.resourceType && <div className="text-danger x-small fw-bold mt-1 ps-1">{errors.resourceType}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-slate-600 small fw-bold">Asset Status</label>
                  <select 
                    disabled={mode === 'view'}
                    className="form-select bg-light border-light text-slate-800 shadow-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label text-slate-600 small fw-bold">Description</label>
                    <textarea 
                      disabled={mode === 'view'}
                      className="form-control bg-light border-light text-slate-800 shadow-none px-3"
                      placeholder="Special instructions, equipment lists, or usage policies..."
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                {/* Location Section */}
                <AnimatePresence>
                  {isFixedResource(formData.resourceType) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="col-12"
                    >
                      <div className="row g-3 p-3 rounded-4 bg-light bg-opacity-50 border border-light">
                        <div className="col-md-3">
                          <label className="form-label text-slate-600 small fw-bold">Building</label>
                          <input 
                            type="text" 
                            disabled={mode === 'view'}
                            className={`form-control bg-white border-light text-slate-800 shadow-none px-3 ${errors.building ? 'is-invalid' : ''}`} 
                            value={formData.building}
                            onChange={(e) => setFormData({...formData, building: e.target.value})}
                          />
                          {errors.building && <div className="text-danger x-small fw-bold mt-1">{errors.building}</div>}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-slate-600 small fw-bold">Floor</label>
                          <input 
                            type="text" 
                            disabled={mode === 'view'}
                            className="form-control bg-white border-light text-slate-800 shadow-none px-3" 
                            value={formData.floor}
                            onChange={(e) => setFormData({...formData, floor: e.target.value})}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-slate-600 small fw-bold">Room</label>
                          <input 
                            type="text" 
                            disabled={mode === 'view'}
                            className="form-control bg-white border-light text-slate-800 shadow-none px-3" 
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-slate-600 small fw-bold">Capacity</label>
                          <input 
                            type="number" 
                            disabled={mode === 'view'}
                            className={`form-control bg-white border-light text-slate-800 shadow-none px-3 ${errors.capacity ? 'is-invalid' : ''}`} 
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                          />
                          {errors.capacity && <div className="text-danger x-small fw-bold mt-1">{errors.capacity}</div>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="col-12 mt-4 pt-3 border-top border-light d-flex justify-content-end gap-3">
                  <button type="button" onClick={onClose} className="btn btn-light px-4 text-slate-700">{mode === 'view' ? 'Close' : 'Cancel'}</button>
                  {(mode === 'edit' || mode === 'create') && (
                    <button type="submit" disabled={isSubmitting || isUploading} className="btn btn-primary fw-bold px-4 shadow-sm">
                      {isSubmitting ? <BiLoaderAlt className="spinner-border spinner-border-sm border-0" /> : <BiSave className="me-2" />}
                      {mode === 'create' ? 'Register Asset' : 'Save Configuration'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .bg-light { background-color: #f8fafc !important; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background: #fff; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
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
    </div>
  );
};

export default ResourceModal;
