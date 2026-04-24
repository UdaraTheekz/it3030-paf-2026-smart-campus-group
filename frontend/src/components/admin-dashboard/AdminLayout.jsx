import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex min-vh-100 overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-auto shadow-sm" style={{ marginLeft: '280px' }}>
        <AdminTopbar />
        
        <main className="p-4 p-lg-5" style={{ backgroundColor: '#f8fafc' }}>
          {children}
        </main>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (max-width: 991.98px) {
          .flex-grow-1 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
