
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from './types';

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<User | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    
    // Skip database fetch if no session is available
    if (!session?.user) {
      console.log("No session available, skipping profile fetch");
      return null;
    }
    
    // First try to fetch from the profiles table (preferred source)
    console.log("Fetching user profile from database");
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching from profiles:", error);
      
      // Fallback to session metadata if database fetch fails
      const { user_metadata } = session.user;
      
      if (user_metadata) {
        console.log("Falling back to user metadata from session:", user_metadata);
        return {
          id: userId,
          email: session.user.email || '',
          firstName: user_metadata.first_name || '',
          lastName: user_metadata.last_name || '',
          role: (user_metadata.role as UserRole) || 'staff'
        };
      }
      
      // Create minimal profile as a last resort
      return {
        id: userId,
        email: session.user.email || '',
        firstName: '',
        lastName: '',
        role: 'staff' as UserRole
      };
    }
    
    if (profileData) {
      console.log("Profile data from database:", profileData);
      return {
        id: userId,
        email: session.user.email || '',
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        role: (profileData.role as UserRole) || 'staff'
      };
    }
    
    // If no database record, create minimal profile
    console.log("No profile found in database, creating minimal profile");
    return {
      id: userId,
      email: session.user.email || '',
      firstName: '',
      lastName: '',
      role: 'staff' as UserRole
    };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Return minimal profile on error
    return {
      id: userId,
      email: session.user?.email || '',
      firstName: '',
      lastName: '',
      role: 'staff' as UserRole
    };
  }
};
