
import { Session } from '@supabase/supabase-js';

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
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>; // Updated return type
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>; // Updated return type
  logout: () => Promise<void>;
  checkOperationalHours: () => boolean;
  isWithinOperationalHours: boolean;
  session: Session | null;
}
