import React, { useState } from 'react'; 
import { Navigate } from 'react-router-dom';
import { Sidebar } from './SidebarAdmin'; 
import { Header } from './HeaderAdmin'; 

export const LayoutAdminDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = sessionStorage.getItem('role');
  // const token = sessionStorage.getItem('token');

  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} role={role} />
      <main className="flex-1 ml-0 lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutAdminDashboard;