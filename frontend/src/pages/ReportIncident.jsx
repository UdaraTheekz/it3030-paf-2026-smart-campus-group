import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiErrorCircle, BiCloudUpload, BiMap, BiCategory, BiArrowBack, BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import MediaUpload from '../utils/MediaUpload';
import toast from 'react-hot-toast';

const ReportIncident = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ELECTRICAL',
    priority: 'MEDIUM',
    resourceId: '',
    location: '',
    preferredContact: ''
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get('/resources');
        setResources(response.data);
      } catch (err) {
        console.error("Failed to fetch resources", err);
      }
    };
    fetchResources();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setFiles(selectedFiles);
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload all selected images to Supabase
      let attachmentUrls = [];
      if (files.length > 0) {
        setUploadProgress(`Uploading ${files.length} image(s) to cloud…`);
        const uploadPromises = files.map(file => MediaUpload(file));
        attachmentUrls = await Promise.all(uploadPromises);
        setUploadProgress('');
      }

      // Step 2: POST JSON with Supabase URLs to backend
      const currentToken = token || localStorage.getItem('token');
      await axiosInstance.post('/tickets', {
        ...formData,
        attachmentUrls,
      }, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        }
      });

      toast.success("Incident reported successfully!");
      navigate('/dashboard/user');

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-slate-50 py-5 px-3 px-md-5">
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 d-flex align-items-center gap-3"
        >
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            <BiArrowBack className="text-slate-600" size={20} />
          </button>
          <div>
            <h1 className="h3 fw-bold text-slate-900 mb-0">Report <span className="text-primary">Incident</span></h1>
            <p className="text-slate-500 mb-0">Help us maintain a better campus by reporting issues.</p>
          </div>
        </motion.div>

        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card bg-white p-4 p-md-5 rounded-4 shadow-sm border-0"
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-700">Issue Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="form-control form-control-lg border-2 border-slate-100 rounded-3 focus-ring"
                    placeholder="Briefly summarize the problem"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-slate-700">Category</label>
                    <div className="input-group">
                      <span className="input-group-text border-2 border-slate-100 bg-slate-50 text-slate-400">
                        <BiCategory />
                      </span>
                      <select 
                        name="category"
                        className="form-select border-2 border-slate-100 rounded-end-3 focus-ring"
                        onChange={handleInputChange}
                        value={formData.category}
                      >
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="PLUMBING">Plumbing</option>
                        <option value="HVAC">HVAC / Cooling</option>
                        <option value="NETWORK">Network / WiFi</option>
                        <option value="FURNITURE">Furniture</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-slate-700">Priority</label>
                    <select 
                      name="priority"
                      className="form-select border-2 border-slate-100 rounded-3 focus-ring"
                      onChange={handleInputChange}
                      value={formData.priority}
                    >
                      <option value="LOW">Low - Minor inconvenience</option>
                      <option value="MEDIUM">Medium - Urgent but manageable</option>
                      <option value="HIGH">High - Critical / Safety issue</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-700">Location / Resource</label>
                  <div className="input-group mb-2">
                    <span className="input-group-text border-2 border-slate-100 bg-slate-50 text-slate-400">
                      <BiMap />
                    </span>
                    <select 
                      name="resourceId"
                      className="form-select border-2 border-slate-100 rounded-end-3 focus-ring"
                      onChange={handleInputChange}
                    >
                      <option value="">Specific Resource (Optional)</option>
                      {resources.map(res => (
                        <option key={res.id} value={res.id}>{res.resourceName} - {res.building}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    name="location"
                    required={!formData.resourceId}
                    className="form-control border-2 border-slate-100 rounded-3 focus-ring"
                    placeholder="Or enter location manualy (e.g. Hall 3, 2nd Floor)"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    className="form-control border-2 border-slate-100 rounded-3 focus-ring"
                    placeholder="Provide details about the issue..."
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-700">Contact Details</label>
                  <input
                    type="text"
                    name="preferredContact"
                    required
                    className="form-control border-2 border-slate-100 rounded-3 focus-ring"
                    placeholder="Phone number or preferred contact method"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-5">
                  <label className="form-label fw-bold text-slate-700">Attachments (Max 3)</label>
                  <div className="upload-container rounded-4 border-2 border-dashed border-slate-200 p-4 text-center bg-slate-50 hover-bg-primary-subtle transition-all cursor-pointer position-relative">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                    />
                    <BiCloudUpload className="text-primary mb-2" size={40} />
                    <p className="text-slate-600 mb-0 fw-medium">Click or drag images here to upload</p>
                    <p className="text-slate-400 small">Supports JPG, PNG up to 5MB each</p>
                  </div>
                  
                  {filePreviews.length > 0 && (
                    <div className="d-flex gap-3 mt-3">
                      {filePreviews.map((url, i) => (
                        <div key={i} className="position-relative">
                          <img src={url} alt="preview" className="rounded-3 shadow-sm border border-white" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-lg w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>Submit Ticket <BiChevronRight size={20} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '2rem' }}>
              <div className="glass-card bg-primary text-white p-4 rounded-4 mb-4 shadow-sm border-0">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-3">
                    <BiErrorCircle size={24} />
                  </div>
                  <h4 className="fw-bold mb-0 text-white">Guidelines</h4>
                </div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3 small opacity-90">
                  <li className="d-flex gap-2">
                    <div className="text-white mt-1">•</div>
                    <span>Be specific about the location so technicians can find it quickly.</span>
                  </li>
                  <li className="d-flex gap-2">
                    <div className="text-white mt-1">•</div>
                    <span>Clear photos help diagnose the issue before arrival.</span>
                  </li>
                  <li className="d-flex gap-2">
                    <div className="text-white mt-1">•</div>
                    <span>High priority is for safety hazards or critical failures.</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card bg-white p-4 rounded-4 shadow-sm border-0">
                <h5 className="fw-bold text-slate-800 mb-3">Recent Reports</h5>
                <p className="text-slate-500 small">You haven't reported any issues recently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-slate-50 { background-color: #f8fafc; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-700 { color: #334155; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-slate-100 { border-color: #f1f5f9 !important; }
        .border-slate-200 { border-color: #e2e8f0 !important; }
        .focus-ring:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
          outline: none;
        }
        .upload-container:hover {
          background-color: #eef2ff !important;
          border-color: #6366f1 !important;
        }
        .glass-card {
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
};

export default ReportIncident;
