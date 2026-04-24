import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin-dashboard/AdminSidebar';
import AdminTopbar from '../components/admin-dashboard/AdminTopbar';
import AdminStatsCards from '../components/admin-dashboard/AdminStatsCards';
import BookingApprovalPanel from '../components/admin-dashboard/BookingApprovalPanel';
import TicketManagementPanel from '../components/admin-dashboard/TicketManagementPanel';
import ResourceOverviewPanel from '../components/admin-dashboard/ResourceOverviewPanel';
import UserManagementPanel from '../components/admin-dashboard/UserManagementPanel';
import NotificationPanel from '../components/admin-dashboard/NotificationPanel';
import RecentActivities from '../components/admin-dashboard/RecentActivities';
import AddResourceForm from '../components/admin-dashboard/AddResourceForm';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import AdminLayout from '../components/admin-dashboard/AdminLayout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalResources: 0,
      activeResources: 0,
      pendingBookings: 0,
      openTickets: 0,
      totalUsers: 0,
      unreadNotifications: 0
    },
    bookings: [],
    tickets: [],
    resources: [],
    users: [],
    notifications: [],
    activities: []
  });

  const fetchData = async () => {
    try {
      const [resBookings, resTickets, resResources, resUsers, resNotifications] = await Promise.all([
        axiosInstance.get('/bookings').catch(() => ({ data: [] })),
        axiosInstance.get('/tickets/all').catch(() => ({ data: [] })),
        axiosInstance.get('/resources').catch(() => ({ data: [] })),
        axiosInstance.get('/users').catch(() => ({ data: [] })),
        axiosInstance.get('/notifications').catch(() => ({ data: [] }))
      ]);

      // Mock data for demonstration if APIs are empty
      const mockBookings = resBookings.data.length ? resBookings.data : [
        { id: '1', userName: 'Alice Johnson', resourceName: 'Main Lab', date: '2026-04-20', timeRange: '09:00 - 11:00 AM', status: 'PENDING' },
        { id: '2', userName: 'Bob Smith', resourceName: 'Conference Room 2', date: '2026-04-21', timeRange: '02:00 - 04:00 PM', status: 'PENDING' }
      ];

      const mockTickets = resTickets.data.length ? resTickets.data : [
        { id: '1', title: 'Server Down', category: 'IT', priority: 'HIGH', status: 'OPEN', reportedBy: 'System Monitor', assignedTechnician: null },
        { id: '2', title: 'Broken Chair', category: 'Furniture', priority: 'LOW', status: 'IN_PROGRESS', reportedBy: 'Charlie Brown', assignedTechnician: 'Jack Repair' }
      ];

      const mockResources = resResources.data.length ? resResources.data : [
        { id: '1', name: 'Science Hall A', type: 'Lecture Hall', location: 'Section B', capacity: 300, status: 'AVAILABLE' },
        { id: '2', name: 'Digital Library 1', type: 'Lab', location: 'Library 3F', capacity: 50, status: 'MAINTENANCE' }
      ];

      const mockUsers = resUsers.data.length ? resUsers.data : [
        { id: '1', name: 'John Admin', email: 'admin@campus.com', role: 'ADMIN', provider: 'LOCAL' },
        { id: '2', name: 'Jane Tech', email: 'jane@campus.com', role: 'TECHNICIAN', provider: 'GOOGLE' },
        { id: '3', name: 'Student Lee', email: 'lee@campus.com', role: 'USER', provider: 'LOCAL' }
      ];

      const mockNotifs = resNotifications.data.length ? resNotifications.data : [
        { id: 1, type: 'BOOKING', message: 'New booking request for Auditorium', timestamp: '2 mins ago', read: false },
        { id: 2, type: 'TICKET', message: 'High priority ticket #432 escalated', timestamp: '1 hour ago', read: false }
      ];

      const mockActivities = [
        { id: 1, type: 'BOOKING_APPROVED', message: 'Auditorium Booking #124 Approved', timestamp: '5 mins ago', user: 'Admin John' },
        { id: 2, type: 'RESOURCE_UPDATED', message: 'Lab #3 marked for maintenance', timestamp: '20 mins ago', user: 'Admin John' },
        { id: 3, type: 'USER_REGISTERED', message: 'New user "Student Lee" joined', timestamp: '1 hour ago', user: 'System' }
      ];

      setData({
        stats: {
          totalResources: mockResources.length,
          activeResources: mockResources.filter(r => r.status === 'AVAILABLE').length,
          pendingBookings: mockBookings.filter(b => b.status === 'PENDING').length,
          openTickets: mockTickets.filter(t => t.status === 'OPEN').length,
          totalUsers: mockUsers.length,
          unreadNotifications: mockNotifs.filter(n => !n.read).length
        },
        bookings: mockBookings,
        tickets: mockTickets,
        resources: mockResources,
        users: mockUsers,
        notifications: mockNotifs,
        activities: mockActivities
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveBooking = async (id) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status?status=APPROVED`);
      toast.success("Booking approved successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data || "Failed to approve booking");
    }
  };

  const handleRejectBooking = async (id, reason) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status?status=REJECTED&reason=${encodeURIComponent(reason)}`);
      toast.success("Booking rejected");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data || "Failed to reject booking");
    }
  };



  return (
    <AdminLayout>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3"
      >
        <div>
          <h2 className="display-6 fw-bold text-slate-900 mb-2">
            System <span className="gradient-text">Administration</span>
          </h2>
          <p className="text-slate-500 mb-0">Smart Campus Operations Hub • Unified Management Interface</p>
        </div>
        <div className="text-sm-end d-none d-md-block">
          <span className="text-slate-400 small d-block mb-1">Last System Sync</span>
          <span className="badge bg-white border border-success border-opacity-20 text-success fw-medium shadow-sm">Live Connection Stable</span>
        </div>
      </motion.div>

      {/* Stats Cards Section */}
      <AdminStatsCards stats={data.stats} />

      <div className="row g-4 mb-4">
        {/* Booking Management */}
        <div className="col-12 col-xl-8">
          <BookingApprovalPanel 
            bookings={data.bookings} 
            onApprove={handleApproveBooking} 
            onReject={handleRejectBooking} 
          />
        </div>
        
        {/* Notifications Section */}
        <div className="col-12 col-xl-4">
          <NotificationPanel notifications={data.notifications} />
        </div>
      </div>

      <div className="row g-4 mb-4">
          {/* Ticket Management */}
          <div className="col-12 col-xl-8">
          <TicketManagementPanel 
            tickets={data.tickets} 
            onAssign={(id) => console.log("Assigning ticket", id)}
            onStatusChange={(id) => console.log("Status change", id)}
          />
        </div>

        {/* Activities Section */}
        <div className="col-12 col-xl-4">
            <RecentActivities activities={data.activities} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Resources Section */}
        <div className="col-12 col-xl-7">
            <div className="mb-4">
              <AddResourceForm onResourceAdded={() => window.location.reload()} />
            </div>
            <ResourceOverviewPanel 
            resources={data.resources}
            onStatusUpdate={(id, s) => console.log("Status update", id, s)}
            onEdit={(res) => console.log("Edit resource", res)}
            />
        </div>

        {/* Users Section */}
        <div className="col-12 col-xl-5">
            <UserManagementPanel 
            users={data.users}
            onChangeRole={(id, r) => console.log("Change role", id, r)}
            />
        </div>
      </div>

      <style>{`
        .text-slate-900 { color: #0f172a; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
