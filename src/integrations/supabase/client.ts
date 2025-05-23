
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gbbhrrdojuhxtmfxkldz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiYmhycmRvanVoeHRtZnhrbGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjI0MzIsImV4cCI6MjA2MzA5ODQzMn0.UY-rhXGXxfvpZyAHYZu5gGixwAHDOsRGygXIVXciaNc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true, // Changed from false to true to ensure session persistence
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Utility function to create sample users
export const createSampleUsers = async () => {
  try {
    // Create admin user
    const { error: adminError } = await supabase.auth.signUp({
      email: 'admin@shra.org',
      password: 'SHRA123!',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      }
    });
    
    if (adminError) throw adminError;
    
    // Create staff user
    const { error: staffError } = await supabase.auth.signUp({
      email: 'staff@shra.org',
      password: 'SHRA123!',
      options: {
        data: {
          first_name: 'Staff',
          last_name: 'User',
          role: 'staff'
        }
      }
    });
    
    if (staffError) throw staffError;
    
    // Create auditor user
    const { error: auditorError } = await supabase.auth.signUp({
      email: 'auditor@shra.org',
      password: 'SHRA123!',
      options: {
        data: {
          first_name: 'Auditor',
          last_name: 'User',
          role: 'auditor'
        }
      }
    });
    
    if (auditorError) throw auditorError;
    
    return { success: true, message: 'Sample users created successfully!' };
  } catch (error) {
    console.error('Error creating sample users:', error);
    return { success: false, message: 'Failed to create sample users' };
  }
};

// Utility function to format address components for geocoding
export const formatAddressComponents = (address: string) => {
  // Sample implementation - in a real app this would use a geocoding service
  // like Google Maps API to extract components and geocode the address
  
  const addressParts = address.split(',').map(part => part.trim());
  
  // Default address components
  const components = {
    street: addressParts[0] || '',
    city: addressParts[1] || '',
    state: '',
    zip: '',
    latitude: null as number | null,
    longitude: null as number | null
  };
  
  // Try to extract state and zip from the last part
  if (addressParts.length > 2) {
    const stateZip = addressParts[addressParts.length - 1].split(' ');
    if (stateZip.length >= 2) {
      components.state = stateZip[0];
      components.zip = stateZip[stateZip.length - 1];
    }
  }
  
  // Simulate geocoding result (would come from an API in real implementation)
  if (address.includes('Sacramento')) {
    components.latitude = 38.5816;
    components.longitude = -121.4944;
  }
  
  return components;
};

