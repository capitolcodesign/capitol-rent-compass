
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

interface TopNavProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b h-16 flex items-center px-4 sticky top-0 z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="mr-4 md:hidden"
      >
        <Menu />
      </Button>
      
      <div className="flex-grow">
        <div className="relative max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search properties or reports..." 
            className="pl-8 bg-gray-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="ml-4 flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div className="ml-2 hidden md:block">
            <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
