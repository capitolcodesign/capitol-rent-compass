
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'admin' | 'staff' | 'auditor';

// Define user structure
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Define auth context structure
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkOperationalHours: () => boolean;
  isWithinOperationalHours: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes - in production this would be in Supabase
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@shra.org',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'staff@shra.org',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'staff',
  },
  {
    id: '3',
    email: 'auditor@shra.org',
    firstName: 'Audit',
    lastName: 'Reviewer',
    role: 'auditor',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithinOperationalHours, setIsWithinOperationalHours] = useState(true);
  
  // Check if the current time is within operational hours (4am to 11:59pm PT)
  const checkOperationalHours = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Operational hours: 4am to 11:59pm (4-23)
    const isWithinHours = hour >= 4 && hour < 24;
    setIsWithinOperationalHours(isWithinHours);
    return isWithinHours;
  };
  
  useEffect(() => {
    // Check operational hours
    checkOperationalHours();
    
    // Set interval to check operational hours every minute
    const interval = setInterval(checkOperationalHours, 60000);
    
    // Check for existing session
    const storedUser = localStorage.getItem('shra_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('shra_user');
      }
    }
    
    setIsLoading(false);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mock login function - would use Supabase Auth in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (simplified auth for demo)
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'password') { // In real app, we'd verify the password properly
      setUser(foundUser);
      localStorage.setItem('shra_user', JSON.stringify(foundUser));
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${foundUser.firstName}!`,
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shra_user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login,
      logout,
      checkOperationalHours,
      isWithinOperationalHours
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
