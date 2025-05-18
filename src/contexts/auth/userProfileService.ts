
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from './types';

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<User | null> => {
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
        role: 'staff' as UserRole
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
