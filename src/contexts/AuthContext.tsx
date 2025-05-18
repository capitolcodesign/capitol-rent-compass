import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkOperationalHours: () => boolean;
  isWithinOperationalHours: boolean;
  session: Session | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
  
  // Function to fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      
      if (profile) {
        console.log("Profile fetched successfully:", profile);
        return {
          id: userId,
          email: session?.user?.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: (profile.role as UserRole) || 'staff'
        };
      }
      
      // If no profile exists yet but we have a user, create a minimal profile
      if (userId && session?.user) {
        console.log("Creating minimal profile for user:", userId);
        return {
          id: userId,
          email: session?.user?.email || '',
          firstName: session?.user?.user_metadata?.first_name || '',
          lastName: session?.user?.user_metadata?.last_name || '',
          role: 'staff' as UserRole // Explicitly cast to UserRole
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    checkOperationalHours();
    const interval = setInterval(checkOperationalHours, 60000);
    
    console.log("Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        // Update the session immediately
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(async () => {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(profile => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);
  
  // Login function using Supabase Auth
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      if (data.user) {
        // Session will be handled by the onAuthStateChange listener
        console.log("Login successful for user:", data.user.id);
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up function using Supabase Auth
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    try {
      // Include the first name and last name in the user metadata
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Show success message
      toast({
        title: 'Sign Up Successful',
        description: 'Your account has been created. Please login to continue.',
      });
      
      // Note: The profile will be created automatically via the database trigger we set up
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign Up Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Logout Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      setUser(null);
      setSession(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  console.log("Auth provider state:", { user, isAuthenticated: !!user, session });
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login,
      signUp,
      logout,
      checkOperationalHours,
      isWithinOperationalHours,
      session
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
