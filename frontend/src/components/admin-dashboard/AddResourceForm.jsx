import React, { useState } from 'react';
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
  BiErrorCircle,
  BiLoaderAlt
} from 'react-icons/bi';
import MediaUpload from '../../utils/MediaUpload';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const RESOURCE_TYPES = [
  "LECTURE_HALL", "COMPUTER_LAB", "MEETING_ROOM", "AUDITORIUM",
  "SEMINAR_HALL", "SPORTS_GROUND", "CONFERENCE_ROOM", "LIBRARY_ROOM",
  "PROJECTOR", "CAMERA_EQUIPMENT", "SOUND_SYSTEM", "LABORATORY_EQUIPMENT"
];

const AddResourceForm = ({ onResourceAdded }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    description: '',
    building: '',
    floor: '',
    roomNumber: '',
    capacity: '',
    status: 'ACTIVE'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isFixedResource = (type) => {
    return ["LECTURE_HALL", "COMPUTER_LAB", "MEETING_ROOM", "AUDITORIUM", "SEMINAR_HALL", "SPORTS_GROUND", "CONFERENCE_ROOM", "LIBRARY_ROOM"].includes(type);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.resourceName) newErrors.resourceName = "Required";
    if (!formData.resourceType) newErrors.resourceType = "Required";
    
    // Only validate location for fixed resources
    if (isFixedResource(formData.resourceType)) {
      if (!formData.building) newErrors.building = "Required";
    }

    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Must be > 0";
    if (!imageUrl) newErrors.image = "Image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsUploading(true);
      try {
        const url = await MediaUpload(file);
        setImageUrl(url);
        toast.success("Image uploaded successfully!");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Clean up location data for mobile resources
      const submissionData = { ...formData };
      if (!isFixedResource(formData.resourceType)) {
        submissionData.building = "";
        submissionData.floor = "";
        submissionData.roomNumber = "";
      }

      await axiosInstance.post('/resources', {
        ...submissionData,
        capacity: parseInt(formData.capacity),
        imageUrl
      });
      toast.success("Resource added successfully!");
      setFormData({
        resourceName: '',
        resourceType: '',
        description: '',
        building: '',
        floor: '',
        roomNumber: '',
        capacity: '',
        status: 'ACTIVE'
      });
      setImageUrl('');
      setImageFile(null);
      if (onResourceAdded) onResourceAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-white shadow-sm"
    >
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-4 bg-primary bg-opacity-10">
          <BiBuildings size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="h5 fw-bold text-slate-800 mb-0">Add New Resource</h3>
          <p className="small text-muted mb-0">Module A: Facilities & Assets Catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Basic Info */}
        <div className="col-md-6">
          <label className="form-label text-slate-600 small fw-semibold">Resource Name</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-light text-muted"><BiInfoCircle /></span>
            <input
              type="text"
              className={`form-control bg-white text-slate-800 border-light ${errors.resourceName ? 'is-invalid' : ''}`}
              value={formData.resourceName}
              onChange={(e) => setFormData({...formData, resourceName: e.target.value})}
              placeholder="e.g. Main Hall"
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-slate-600 small fw-semibold">Resource Type</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-light text-muted"><BiCategory /></span>
            <select
              className={`form-select bg-white text-slate-800 border-light ${errors.resourceType ? 'is-invalid' : ''}`}
              value={formData.resourceType}
              onChange={(e) => setFormData({...formData, resourceType: e.target.value})}
            >
              <option value="" disabled>Select Type</option>
              {RESOURCE_TYPES.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12">
          <label className="form-label text-slate-600 small fw-semibold">Description</label>
          <textarea
            className="form-control bg-white text-slate-800 border-light"
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Technical details, usage instructions, etc."
          ></textarea>
        </div>

        {/* Location Info - Rendered only for fixed resources */}
        <AnimatePresence mode="wait">
          {isFixedResource(formData.resourceType) && (
            <motion.div 
              key="location-info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="col-12 overflow-hidden"
            >
              <div className="row g-3 pt-2">
                <div className="col-md-4">
                  <label className="form-label text-slate-600 small fw-semibold">Building</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-light text-muted"><BiMap /></span>
                    <input
                      type="text"
                      className={`form-control bg-white text-slate-800 border-light ${errors.building ? 'is-invalid' : ''}`}
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      placeholder="Bld 01"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label text-slate-600 small fw-semibold">Floor</label>
                  <input
                    type="text"
                    className="form-control bg-white text-slate-800 border-light"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    placeholder="1st"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-slate-600 small fw-semibold">Room No.</label>
                  <input
                    type="text"
                    className="form-control bg-white text-slate-800 border-light"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    placeholder="101"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Capacity Section */}
        <div className="col-md-6">
          <label className="form-label text-slate-600 small fw-semibold">Capacity</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-light text-muted"><BiGroup /></span>
            <input
              type="number"
              className={`form-control bg-white text-slate-800 border-light ${errors.capacity ? 'is-invalid' : ''}`}
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              placeholder="0"
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-slate-600 small fw-semibold">Status</label>
          <select
            className="form-select bg-white text-slate-800 border-light"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
          </select>
        </div>

        <div className="col-12 mt-3">
          <label className="form-label text-slate-600 small fw-semibold">Resource Image</label>
          <div className="input-group">
            <input
              type="file"
              className={`form-control bg-white text-slate-800 border-light ${errors.image ? 'is-invalid' : ''}`}
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            {isUploading && (
              <span className="input-group-text bg-white border-light text-primary">
                <BiLoaderAlt className="spinner-border spinner-border-sm border-0" />
              </span>
            )}
          </div>
          {imageUrl && (
            <div className="mt-2 position-relative d-inline-block">
              <img src={imageUrl} alt="Preview" className="rounded-3 border border-light shadow-sm" style={{ height: '60px', width: '100px', objectFit: 'cover' }} />
              <BiCheckCircle className="position-absolute top-0 end-0 text-success bg-white rounded-circle translate-middle" />
            </div>
          )}
        </div>

        <div className="col-12 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || isUploading}
            className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm py-3"
          >
            {isSubmitting ? <BiLoaderAlt className="spinner-border spinner-border-sm border-0" /> : <BiBuildings size={20} />}
            {isSubmitting ? 'Registering Resource...' : 'Register Asset to Catalogue'}
          </motion.button>
        </div>
      </form>

      <style>{`
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .border-light { border-color: #e2e8f0 !important; }
      `}</style>
    </motion.div>
  );
};

export default AddResourceForm;
