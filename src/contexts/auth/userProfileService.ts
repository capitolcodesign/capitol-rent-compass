
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
    
    // Extract user metadata from session directly
    const { user_metadata } = session.user;
    
    if (user_metadata) {
      console.log("Using user metadata from session:", user_metadata);
      // Create user from session metadata without database query
      // This avoids the recursive RLS policy issue
      return {
        id: userId,
        email: session.user.email || '',
        firstName: user_metadata.first_name || '',
        lastName: user_metadata.last_name || '',
        // Cast role to UserRole type to satisfy TypeScript
        role: (user_metadata.role as UserRole) || 'staff'
      };
    }
    
    // If no metadata available, check database as fallback
    console.log("No metadata in session, checking database");
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching from profiles:", error);
      // Create minimal profile if database fetch fails
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
