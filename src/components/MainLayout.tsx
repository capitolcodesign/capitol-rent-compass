
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import MaintenanceBanner from '@/components/MaintenanceBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, isLoading, isWithinOperationalHours } = useAuth();
  
  // Prevent layout shifts by waiting for auth state to stabilize
  const [stableAuth, setStableAuth] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setStableAuth(true);
    }
  }, [isLoading]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Show loading state while auth is determining
  if (!stableAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-capitol-cream">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-capitol-charcoal">Loading application...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      {isAuthenticated ? (
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
      ) : (
        <div className="w-full">
          {!isWithinOperationalHours && <MaintenanceBanner />}
          {children}
        </div>
      )}
    </div>
  );
};

export default MainLayout;
