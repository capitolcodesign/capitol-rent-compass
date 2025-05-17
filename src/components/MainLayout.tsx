
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import MaintenanceBanner from '@/components/MaintenanceBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, isWithinOperationalHours } = useAuth();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="app-container">
      {isAuthenticated && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
            <TopNav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="content-area">
              {!isWithinOperationalHours && <MaintenanceBanner />}
              {children}
            </div>
          </div>
        </>
      )}
      
      {!isAuthenticated && (
        <div className="w-full">
          {!isWithinOperationalHours && <MaintenanceBanner />}
          {children}
        </div>
      )}
    </div>
  );
};

export default MainLayout;
