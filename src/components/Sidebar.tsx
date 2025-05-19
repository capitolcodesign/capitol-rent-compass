
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
  Database,
  PlusCircle,
  ListPlus,
  ClipboardList,
  LayoutDashboard,
  Lock
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

type NavGroup = {
  title: string;
  items: NavItem[];
  roles: string[];
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      roles: ['admin', 'staff', 'auditor'],
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'auditor'] },
      ]
    },
    {
      title: "Properties",
      roles: ['admin', 'staff', 'auditor'],
      items: [
        { name: 'Property Database', path: '/properties', icon: Database, roles: ['admin', 'staff', 'auditor'] },
        { name: 'Add Property', path: '/properties/new', icon: PlusCircle, roles: ['admin', 'staff'] },
      ]
    },
    {
      title: "Analysis",
      roles: ['admin', 'staff', 'auditor'],
      items: [
        { name: 'Rent Analysis', path: '/analysis', icon: BarChart3, roles: ['admin', 'staff', 'auditor'] },
        { name: 'Rental Fairness', path: '/rental-fairness', icon: Scale, roles: ['admin', 'staff', 'auditor'] },
      ]
    },
    {
      title: "Reports",
      roles: ['admin', 'staff', 'auditor'],
      items: [
        { name: 'Reports List', path: '/reports', icon: FileText, roles: ['admin', 'staff', 'auditor'] },
        { name: 'Create Report', path: '/reports/new', icon: ListPlus, roles: ['admin', 'staff'] },
      ]
    },
    {
      title: "Administration",
      roles: ['admin'],
      items: [
        { name: 'User Management', path: '/users', icon: Users, roles: ['admin'] },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
      ]
    }
  ];
  
  // Filter nav groups based on user role
  const filteredNavGroups = navGroups.filter(
    group => user && group.roles.includes(user.role)
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
        
        <div className="py-4 overflow-y-auto h-[calc(100%-8rem)]">
          <nav className="space-y-6 px-2">
            {filteredNavGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {isOpen && (
                  <h3 className="ml-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50 mb-2">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
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
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 px-4">
          {isOpen && user && (
            <div className="mb-4 px-2 py-2 bg-sidebar-accent rounded-md">
              <div className="flex items-center">
                {user.role === 'admin' && (
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                )}
                {user.role === 'staff' && (
                  <ClipboardList className="h-4 w-4 mr-2 text-blue-500" />
                )}
                {user.role === 'auditor' && (
                  <Lock className="h-4 w-4 mr-2 text-amber-500" />
                )}
                <div className="text-sm font-medium truncate">{user.firstName} {user.lastName}</div>
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
