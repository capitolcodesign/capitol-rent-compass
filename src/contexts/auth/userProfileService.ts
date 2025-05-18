
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
        
        // Try to create a profile from the metadata
        try {
          const newProfile = {
            id: userId,
            first_name: user_metadata.first_name || '',
            last_name: user_metadata.last_name || '',
            role: (user_metadata.role as string) || 'staff'
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
            
          if (insertError) {
            console.error("Error creating profile from metadata:", insertError);
          } else {
            console.log("Created new profile from metadata for user");
          }
          
          // Return user object based on metadata
          return {
            id: userId,
            email: session.user.email || '',
            firstName: newProfile.first_name,
            lastName: newProfile.last_name,
            role: newProfile.role as UserRole
          };
        } catch (createError) {
          console.error("Error creating profile from metadata:", createError);
        }
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
      
      // If profile exists but is missing data, attempt to update it from metadata
      if (!profileData.first_name || !profileData.last_name) {
        const { user_metadata } = session.user;
        
        if (user_metadata && (user_metadata.first_name || user_metadata.last_name)) {
          try {
            const updateData: any = {};
            
            if (!profileData.first_name && user_metadata.first_name) {
              updateData.first_name = user_metadata.first_name;
            }
            
            if (!profileData.last_name && user_metadata.last_name) {
              updateData.last_name = user_metadata.last_name;
            }
            
            if (Object.keys(updateData).length > 0) {
              await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);
                
              // Update local profileData
              Object.assign(profileData, updateData);
            }
          } catch (updateError) {
            console.error("Error updating profile:", updateError);
          }
        }
      }
      
      return {
        id: userId,
        email: session.user.email || '',
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        role: (profileData.role as UserRole) || 'staff'
      };
    }
    
    // If no database record, create profile from metadata
    console.log("No profile found in database, creating profile from metadata");
    const { user_metadata } = session.user;
    
    // Create a new profile record
    try {
      const newProfile = {
        id: userId,
        first_name: user_metadata?.first_name || '',
        last_name: user_metadata?.last_name || '',
        role: (user_metadata?.role as string) || 'staff'
      };
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile);
        
      if (insertError) {
        console.error("Error creating new profile:", insertError);
      } else {
        console.log("Created new profile for user");
      }
      
      // Return user object
      return {
        id: userId,
        email: session.user.email || '',
        firstName: newProfile.first_name,
        lastName: newProfile.last_name,
        role: newProfile.role as UserRole
      };
    } catch (createError) {
      console.error("Error creating profile:", createError);
    }
    
    // Return minimal profile on failure
    return {
      id: userId,
      email: session.user?.email || '',
      firstName: user_metadata?.first_name || '',
      lastName: user_metadata?.last_name || '',
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
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error("Error checking for existing profile:", fetchError);
      return false;
    }
    
    const profileData = {
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role
    };
    
    if (existing) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
        return false;
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData
        });
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in createOrUpdateProfile:", error);
    return false;
  }
};
