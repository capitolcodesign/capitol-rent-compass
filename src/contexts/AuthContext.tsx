
// This file is kept for backwards compatibility
// Import and re-export the AuthContext from the new location
export { AuthProvider, useAuth } from './auth';
export type { User, UserRole, AuthContextType } from './auth/types';
