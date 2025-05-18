
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
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
  LogOut,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Property Database', path: '/properties', icon: Building2, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Rent Analysis', path: '/analysis', icon: BarChart3, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Rental Fairness', path: '/rental-fairness', icon: Scale, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Reports', path: '/reports', icon: FileText, roles: ['admin', 'staff', 'auditor'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  ];
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  // Custom styles for active and inactive items
  const activeLinkClass = "bg-sidebar-accent text-sidebar-foreground";
  const inactiveLinkClass = "text-sidebar-foreground/70 hover:bg-sidebar-accent/50";
  
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
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
              return isOpen ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors group",
                    isActive ? activeLinkClass : inactiveLinkClass
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 text-sidebar-primary" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <TooltipProvider key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex justify-center items-center p-2 text-sm rounded-md transition-colors",
                          isActive ? activeLinkClass : inactiveLinkClass
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 px-4">
          {isOpen && user && (
            <div className="mb-4 px-2 py-2 bg-sidebar-accent rounded-md">
              <div className="flex items-center">
                {user.role === 'admin' && (
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                )}
                <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
              </div>
              <div className="text-xs text-sidebar-foreground/80 mt-1 capitalize">{user.role}</div>
            </div>
          )}
          
          {isOpen ? (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full flex items-center justify-center text-sm rounded-md hover:bg-sidebar-accent"
            >
              <LogOut className="mr-3 h-4 w-4 text-sidebar-primary" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="w-full flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
