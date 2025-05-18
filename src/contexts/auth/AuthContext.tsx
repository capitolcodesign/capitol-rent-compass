
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from './types';
import { fetchUserProfile } from './userProfileService';
import { login as authLogin, signUp as authSignUp, logout as authLogout } from './authService';
import { checkOperationalHours as checkHours } from './operationalHoursService';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithinOperationalHours, setIsWithinOperationalHours] = useState(true);
  
  // Check operational hours and set state
  const checkOperationalHours = () => {
    const isWithinHours = checkHours();
    setIsWithinOperationalHours(isWithinHours);
    return isWithinHours;
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
            const profile = await fetchUserProfile(currentSession.user.id, currentSession);
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
        fetchUserProfile(currentSession.user.id, currentSession).then(profile => {
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
  
  // Login function wrapper
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up function wrapper
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      await authSignUp(email, password, firstName, lastName);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function wrapper
  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      setSession(null);
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
