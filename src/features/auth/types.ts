
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'manager' | 'readonly';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
}
