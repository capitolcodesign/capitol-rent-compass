
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthResponse } from './types';

// Login function using Supabase Auth
export const login = async (email: string, password: string): Promise<AuthResponse> => {
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
      console.log("Login successful for user:", data.user.id);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign up function using Supabase Auth
export const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> => {
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
    
    // Profile creation is now handled by database trigger via the SQL migration
    
    // Show success message
    toast({
      title: 'Sign Up Successful',
      description: 'Your account has been created. Please login to continue.',
    });
    
    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    toast({
      title: 'Sign Up Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};

// Admin create user function
export const adminCreateUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: string
): Promise<any> => {
  try {
    console.log(`Creating new user (${email}, role: ${role})`);
    
    // Use the standard signup method since the admin API requires additional permissions
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role
        }
      }
    });

    if (error) {
      console.error("User creation failed:", error);
      toast({
        title: 'User Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    console.log("Auth signup successful");

    toast({
      title: 'User Created',
      description: `Successfully added user: ${email}`,
    });

    return data;
  } catch (error: any) {
    console.error('Admin create user error:', error);
    toast({
      title: 'User Creation Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};

// Logout function
export const logout = async () => {
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
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
