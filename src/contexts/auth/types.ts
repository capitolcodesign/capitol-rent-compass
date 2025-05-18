
import { Session, User as SupabaseUser, WeakPassword } from '@supabase/supabase-js';

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

// Define auth response type for login and signup
export interface AuthResponse {
  user: SupabaseUser | null;
  session: Session | null;
  weakPassword?: WeakPassword | null;
}

// Define auth context structure
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>; 
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<AuthResponse>; 
  logout: () => Promise<void>;
  checkOperationalHours: () => boolean;
  isWithinOperationalHours: boolean;
  session: Session | null;
}
