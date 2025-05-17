
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import { 
  Home, 
  BarChart3, 
  Building2, 
  FileText, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  BarChart4,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Property Database', path: '/properties', icon: Building2, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Rent Analysis', path: '/analysis', icon: BarChart3, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Reports', path: '/reports', icon: FileText, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  ];
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground w-64 z-30 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {isOpen ? (
            <Logo size="sm" />
          ) : (
            <div className="w-8 h-8">
              <img 
                src="/lovable-uploads/33c86c21-a65a-47cc-bc48-c84732a3e5fd.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-sidebar-foreground hover:bg-sidebar-accent md:flex hidden"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        
        <div className="py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-sidebar-accent group transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5 text-sidebar-primary" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 px-4">
          {isOpen && (
            <div className="mb-4 px-2 py-2 bg-sidebar-accent rounded-md">
              <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-sidebar-foreground/80 capitalize">{user?.role}</div>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full flex items-center justify-center text-sm rounded-md hover:bg-sidebar-accent"
          >
            <LogOut className="mr-3 h-4 w-4 text-sidebar-primary" />
            {isOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
