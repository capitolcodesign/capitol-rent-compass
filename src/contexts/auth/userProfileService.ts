
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from './types';
import { toast } from '@/components/ui/use-toast';

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<User | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    
    // Skip database fetch if no session is available
    if (!session?.user) {
      console.log("No session available, skipping profile fetch");
      return null;
    }
    
    // Fetch from the profiles table
    console.log("Fetching user profile from database");
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching profile:", error);
      
      // Use session metadata as fallback
      const { user_metadata } = session.user;
      
      // Return user object based on metadata
      return {
        id: userId,
        email: session.user.email || '',
        firstName: user_metadata?.first_name || '',
        lastName: user_metadata?.last_name || '',
        role: (user_metadata?.role as UserRole) || 'staff'
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
    
    // If no profile found, return basic user info
    return {
      id: userId,
      email: session.user?.email || '',
      firstName: '',
      lastName: '',
      role: 'staff' as UserRole
    };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast({
      title: 'Profile Error',
      description: 'Could not fetch your profile. Please try again later.',
      variant: 'destructive',
    });
    
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

// Function to create or update user profile
export const createOrUpdateProfile = async (userId: string, data: {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}): Promise<boolean> => {
  try {
    const profileData = {
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role
    };
    
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        ...profileData
      }, {
        onConflict: 'id'
      });
        
    if (upsertError) {
      console.error("Error creating/updating profile:", upsertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createOrUpdateProfile:", error);
    return false;
  }
};
