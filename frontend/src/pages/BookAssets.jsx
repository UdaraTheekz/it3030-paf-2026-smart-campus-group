import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BiArrowBack, 
  BiSearch, 
  BiFilterAlt, 
  BiBuilding, 
  BiInfoCircle, 
  BiCalendarPlus,
  BiCheckCircle,
  BiLoaderAlt,
  BiX,
  BiGroup
} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import toast from 'react-hot-toast';

const CATEGORIES = [
  "ALL", "LECTURE_HALL", "COMPUTER_LAB", "MEETING_ROOM", "AUDITORIUM",
  "SEMINAR_HALL", "SPORTS_GROUND", "CONFERENCE_ROOM", "LIBRARY_ROOM",
  "PROJECTOR", "CAMERA_EQUIPMENT", "SOUND_SYSTEM", "LABORATORY_EQUIPMENT"
];

const BookAssets = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  // Booking Modal States
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/resources');
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (error) {
      toast.error("Failed to load campus resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = resources;
    if (selectedCategory !== "ALL") {
      result = result.filter(r => r.resourceType === selectedCategory);
    }
    if (searchTerm) {
      result = result.filter(r => 
        r.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.resourceCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredResources(result);
  }, [searchTerm, selectedCategory, resources]);

  const handleBookRequest = async (e) => {
    e.preventDefault();
    if (!bookingDate || !timeSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    if (!purpose.trim()) {
      toast.error("Please provide a purpose for reservation");
      return;
    }

    // Sri Lankan phone number validation
    const slPhoneRegex = /^(?:\+94|0)?7\d{8}$/;
    if (!slPhoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid Sri Lankan phone number");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/bookings', {
        resourceId: selectedResource.id,
        resourceName: selectedResource.resourceName,
        date: bookingDate,
        timeRange: timeSlot,
        purpose: purpose,
        phoneNumber: phoneNumber
      });
      toast.success("Booking request submitted successfully!");
      setIsModalOpen(false);
      // Optional: Navigate to my bookings
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Failed to submit booking request";
      toast.error(errorMsg);
    } finally {

      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar active="bookings" />
      
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '280px' }}>
        <Topbar />
        
        <main className="p-4 p-lg-5">
          {/* Header section */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div className="d-flex align-items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard/user')}
                className="btn btn-icon btn-white shadow-sm border border-light text-slate-600 rounded-circle p-2"
              >
                <BiArrowBack size={20} />
              </button>
              <div>
                <h2 className="display-6 fw-bold text-slate-900 mb-1">
                  Book <span className="gradient-text">Assets</span>
                </h2>
                <p className="text-slate-500 mb-0">Browse and reserve campus facilities and equipment</p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="input-group bg-white rounded-pill px-3 py-1 shadow-sm border border-light" style={{ minWidth: '300px' }}>
                <span className="input-group-text bg-transparent border-0 text-slate-400">
                  <BiSearch size={20} />
                </span>
                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent text-slate-800 shadow-none ps-0" 
                  placeholder="Find resources by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>



          

          {/* Categories Filter */}
          <div className="mb-5 overflow-auto pb-2 custom-scrollbar">
            <div className="d-flex gap-2" style={{ minWidth: 'max-content' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all shadow-sm ${
                    selectedCategory === cat 
                    ? 'btn-primary border-0' 
                    : 'btn-white border-light text-slate-600 hover-bg-primary hover-text-white'
                  }`}
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          {loading ? (
             <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <BiLoaderAlt className="spinner-border spinner-border-sm border-0 text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
                <p className="text-slate-500 fw-medium">Preparing the catalogue...</p>
             </div>
          ) : filteredResources.length > 0 ? (
            <div className="row g-4">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="col-12 col-md-6 col-xl-4"
                  >
                    <div 
                      onClick={() => {
                        setSelectedResource(resource);
                        setIsDetailsModalOpen(true);
                      }}
                      className="glass-card bg-white border-white overflow-hidden h-100 hover-shadow-xl transition-all group border border-light cursor-pointer"
                    >
                      {/* Image Area */}
                      <div className="position-relative">
                        <img 
                          src={resource.imageUrl || 'https://via.placeholder.com/400x200?text=No+Preview'} 
                          alt={resource.resourceName}
                          className="w-100 object-fit-cover transition-all"
                          style={{ height: '200px' }}
                        />
                        <div className="position-absolute top-0 end-0 p-3">
                           <span className={`badge px-3 py-1 rounded-pill shadow-sm fw-bold border border-white ${
                             resource.status === 'ACTIVE' 
                             ? 'bg-success text-white' 
                             : 'bg-danger text-white'
                           }`} style={{ fontSize: '0.65rem' }}>
                             {resource.status === 'ACTIVE' ? 'AVAILABLE' : 'MAINTENANCE'}
                           </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="h6 fw-bold text-slate-900 mb-0">{resource.resourceName}</h3>
                          <span className="text-slate-400 small fw-bold">{resource.resourceCode}</span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2 mb-4 text-slate-500 small">
                          <BiBuilding className="text-primary" />
                          <span>{resource.building} {resource.floor && `• Floor ${resource.floor}`}</span>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                          <div className="d-flex align-items-center gap-1 text-slate-400 small fw-bold">
                             <BiGroup /> {resource.capacity} Seats
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResource(resource);
                              setIsModalOpen(true);
                            }}
                            disabled={resource.status !== 'ACTIVE'}
                            className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                          >
                            <BiCalendarPlus /> Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-5" style={{ paddingRight: '120px' }}>
               <div className="p-4 rounded-circle bg-white shadow-sm border border-light d-inline-block mb-3">
                 <BiFilterAlt size={48} className="text-slate-200" />
               </div>
               <h4 className="h5 fw-bold text-slate-900">No assets found</h4>
               <p className="text-slate-500">Try adjusting your filters or search keywords</p>
               <button onClick={() => { setSelectedCategory("ALL"); setSearchTerm(""); }} className="btn btn-link text-primary fw-bold text-decoration-none small">Clear All Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay d-flex align-items-center justify-content-center p-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card bg-white p-0 border-white shadow-2xl overflow-hidden"
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <div className="px-4 py-3 border-bottom border-light d-flex justify-content-between align-items-center bg-primary bg-opacity-5">
                <div className="d-flex align-items-center gap-2 text-primary">
                  <BiCalendarPlus size={24} />
                  <h5 className="mb-0 fw-bold">Reserve Resource</h5>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="btn-close shadow-none"></button>
              </div>

              <div className="p-4">
                <div className="mb-4 d-flex gap-3 align-items-center p-3 rounded-4 bg-light border border-light">
                   <img src={selectedResource?.imageUrl} className="rounded-3 shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt="" />
                   <div>
                      <h4 className="h6 fw-bold text-slate-900 mb-1">{selectedResource?.resourceName}</h4>
                      <p className="small text-slate-500 mb-0">{selectedResource?.building} • {selectedResource?.resourceCode}</p>
                   </div>
                </div>

                <form onSubmit={handleBookRequest}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-slate-600">Reservation Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-3 border-light bg-light shadow-none px-3 py-2"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-slate-600">Preferred Time Slot</label>
                    <select 
                      className="form-select rounded-3 border-light bg-light shadow-none px-3 py-2"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      required
                    >
                      <option value="">Select a slot...</option>
                      <option value="08:00 - 10:00">08:00 AM - 10:00 AM</option>
                      <option value="10:00 - 12:00">10:00 AM - 12:00 PM</option>
                      <option value="12:00 - 14:00">12:00 PM - 02:00 PM</option>
                      <option value="14:00 - 16:00">02:00 PM - 04:00 PM</option>
                      <option value="16:00 - 18:00">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-slate-600">Contact Number (Sri Lanka)</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 border-light bg-light shadow-none px-3 py-2"
                      placeholder="e.g., 0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-slate-600">Purpose for Reservation</label>
                    <textarea 
                      className="form-control rounded-3 border-light bg-light shadow-none px-3 py-2"
                      rows="3"
                      placeholder="Describe why you need this asset..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex gap-3 pt-3 border-top border-light">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-light flex-grow-1 rounded-pill fw-bold text-slate-600">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="btn btn-primary flex-grow-1 rounded-pill fw-bold shadow-md d-flex align-items-center justify-content-center gap-2"
                    >
                      {submitting ? <BiLoaderAlt className="spinner-border spinner-border-sm border-0" /> : <BiCheckCircle />}
                      {submitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && (
          <div className="modal-overlay d-flex align-items-center justify-content-center p-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card bg-white p-0 border-white shadow-2xl overflow-hidden"
              style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh' }}
            >
              <div className="px-4 py-3 border-bottom border-light d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center gap-2 text-slate-900">
                  <BiInfoCircle size={24} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Asset Specification</h5>
                </div>
                <button onClick={() => setIsDetailsModalOpen(false)} className="btn-close shadow-none"></button>
              </div>

              <div className="modal-body overflow-auto p-0" style={{ maxHeight: 'calc(90vh - 60px)' }}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <img 
                      src={selectedResource?.imageUrl || 'https://via.placeholder.com/400x400?text=No+Preview'} 
                      alt="" 
                      className="w-100 h-100 object-fit-cover"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                  <div className="col-md-7 p-4">
                    <div className="mb-4">
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 mb-2 px-3 py-1 fw-bold rounded-pill">
                        {selectedResource?.resourceType?.replace(/_/g, ' ')}
                      </span>
                      <h3 className="h4 fw-bold text-slate-900 mb-1">{selectedResource?.resourceName}</h3>
                      <p className="text-slate-500 small mb-0 fw-medium">Ref Code: {selectedResource?.resourceCode}</p>
                    </div>

                    <div className="row g-3 mb-4">
                       <div className="col-6">
                         <div className="p-3 rounded-4 bg-light border border-light">
                           <p className="small text-slate-400 fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Building</p>
                           <p className="text-slate-700 mb-0 fw-bold">{selectedResource?.building}</p>
                         </div>
                       </div>
                       <div className="col-6">
                         <div className="p-3 rounded-4 bg-light border border-light">
                           <p className="small text-slate-400 fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Location</p>
                           <p className="text-slate-700 mb-0 fw-bold">Floor {selectedResource?.floor || '0'} • {selectedResource?.roomNumber || 'N/A'}</p>
                         </div>
                       </div>
                    </div>

                    <div className="mb-4">
                       <p className="small text-slate-400 fw-bold text-uppercase mb-2" style={{ fontSize: '0.6rem' }}>Description</p>
                       <p className="text-slate-600 small line-height-relaxed mb-0">
                         {selectedResource?.description || "This high-performance campus facility is equipped for both individual and collaborative work sessions. Featuring ergonomic seating and climate control for optimal comfort."}
                       </p>
                    </div>

                    <div className="d-flex gap-3 mt-5">
                      <button 
                        onClick={() => {
                          setIsDetailsModalOpen(false);
                          setIsModalOpen(true);
                        }}
                        disabled={selectedResource?.status !== 'ACTIVE'}
                        className="btn btn-primary flex-grow-1 rounded-pill py-2 fw-bold shadow-md d-flex align-items-center justify-content-center gap-2"
                      >
                        <BiCalendarPlus size={20} /> Proceed to Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .bg-light { background-color: #f8fafc !important; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }
        .border-light { border-color: #f1f5f9 !important; }
        .btn-white { background-color: #ffffff; border: 1px solid #f1f5f9; }
        .hover-bg-primary:hover { background-color: #0d6efd !important; border-color: #0d6efd !important; }
        .hover-text-white:hover { color: #ffffff !important; }
        .hover-shadow-xl:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1060;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default BookAssets;
