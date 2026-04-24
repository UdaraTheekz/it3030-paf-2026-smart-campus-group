import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BiGridAlt, 
  BiTask, 
  BiCalendarCheck, 
  BiWrench, 
  BiGroup, 
  BiBell, 
  BiBarChartSquare, 
  BiUser, 
  BiLogOut 
} from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <BiGridAlt />, path: '/dashboard/admin' },
    { name: 'Manage Resources', icon: <BiTask />, path: '/dashboard/admin/resources' },
    { name: 'Manage Bookings', icon: <BiCalendarCheck />, path: '/dashboard/admin/bookings' },
    { name: 'Manage Tickets', icon: <BiWrench />, path: '/dashboard/admin/tickets' },
    { name: 'Manage Users', icon: <BiGroup />, path: '/dashboard/admin/users' },
    { name: 'Reports / Analytics', icon: <BiBarChartSquare />, path: '/dashboard/admin/reports' },
    { name: 'Profile', icon: <BiUser />, path: '/dashboard/admin/profile' },
  ];

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="bg-white vh-100 position-fixed start-0 top-0 border-end border-light d-none d-lg-flex flex-column shadow-sm"
      style={{ width: '280px', zIndex: 1000 }}
    >
      <div className="p-4 mb-3 border-bottom border-light">
        <h3 className="h5 fw-bold gradient-text mb-0">Admin Central</h3>
        <p className="small text-muted mb-0">Smart Campus Operations Hub</p>
      </div>

      <nav className="flex-grow-1 px-3 mt-3 overflow-auto">
        {menuItems.map((item) => (
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
            <span className="small fw-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-top border-light">
        <button
          onClick={logout}
          className="btn btn-link nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 w-100 text-danger border-0 text-start text-decoration-none hover-bg-danger-light"
        >
          <BiLogOut />
          <span className="small fw-semibold">Logout</span>
        </button>
      </div>

      <style>{`
        .text-slate-600 { color: #475569; }
        .hover-bg-light:hover { background-color: #f1f5f9; color: #1e293b; }
        .hover-bg-danger-light:hover { background-color: #fef2f2; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      `}</style>
    </motion.div>
  );
};

export default AdminSidebar;
