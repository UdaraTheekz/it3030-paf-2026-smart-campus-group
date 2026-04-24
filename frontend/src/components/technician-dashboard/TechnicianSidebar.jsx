import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BiGridAlt, 
  BiTask, 
  BiWrench, 
  BiCheckCircle, 
  BiChat, 
  BiBell, 
  BiUser, 
  BiLogOut,
  BiCalendarCheck
} from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const TechnicianSidebar = ({ onProfileClick }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <BiGridAlt />, path: '/dashboard/technician' },
    { name: 'Assigned Tickets', icon: <BiTask />, path: '/dashboard/technician/assigned' },
    { name: 'In Progress', icon: <BiWrench />, path: '/dashboard/technician/in-progress' },
    { name: 'Resolved Tickets', icon: <BiCheckCircle />, path: '/dashboard/technician/resolved' },
    { name: 'Booking Management', icon: <BiCalendarCheck />, path: '/dashboard/technician/bookings' },
    { name: 'Profile', icon: <BiUser />, isAction: true, onClick: onProfileClick },
  ];

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="bg-white vh-100 position-fixed start-0 top-0 border-end border-light d-none d-lg-flex flex-column shadow-sm"
      style={{ width: '280px', zIndex: 1000 }}
    >
      <div className="p-4 mb-3 border-bottom border-light">
        <h3 className="h5 fw-bold text-slate-900 mb-0">Tech<span className="text-primary">Console</span></h3>
        <p className="small text-slate-500 fw-medium mb-0">Operations Workbench</p>
      </div>

      <nav className="flex-grow-1 px-3 mt-3 overflow-auto">
        {menuItems.map((item) => 
          item.isAction ? (
            <button
              key={item.name}
              onClick={item.onClick}
              className="btn btn-link nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 mb-1 transition-all text-slate-600 hover-bg-light text-decoration-none text-start border-0 w-100"
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span className="small fw-bold">{item.name}</span>
            </button>
          ) : (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 mb-1 transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover-bg-light'
                }`
              }
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span className="small fw-bold">{item.name}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="p-3 border-top border-light">
        <button
          onClick={logout}
          className="btn btn-link nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 w-100 text-slate-500 border-0 text-start text-decoration-none hover-bg-danger-light hover-text-danger transition-all"
        >
          <BiLogOut size={20} />
          <span className="small fw-bold">Sign Out</span>
        </button>
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .hover-bg-light:hover { background-color: #f8fafc; color: #1e293b; }
        .hover-bg-danger-light:hover { background-color: #fef2f2; }
        .hover-text-danger:hover { color: #ef4444 !important; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      `}</style>
    </motion.div>
  );
};

export default TechnicianSidebar;
