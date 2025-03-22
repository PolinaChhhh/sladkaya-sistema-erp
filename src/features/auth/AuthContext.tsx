
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState, UserProfile } from './types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: () => false,
  isManager: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  // Fetch user profile including role
  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) throw roleError;

      return {
        ...profile,
        role: roleData.role as UserProfile['role'],
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // First check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const profile = await fetchUserProfile(session.user.id);
        setState({
          user: session.user,
          session,
          profile,
          isLoading: false,
        });
      } else {
        setState({ ...initialState, isLoading: false });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const profile = await fetchUserProfile(session.user.id);
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
          });
        } else {
          setState({ ...initialState, isLoading: false });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState({ ...state, isLoading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        const profile = await fetchUserProfile(data.session.user.id);
        setState({
          user: data.session.user,
          session: data.session,
          profile,
          isLoading: false,
        });
        toast.success('Logged in successfully');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      setState({ ...state, isLoading: false });
    }
  };

  const signOut = async () => {
    try {
      setState({ ...state, isLoading: true });
      await supabase.auth.signOut();
      setState({ ...initialState, isLoading: false });
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
      setState({ ...state, isLoading: false });
    }
  };

  // Role-based permission helpers
  const isAdmin = () => state.profile?.role === 'admin';
  const isManager = () => ['admin', 'manager'].includes(state.profile?.role || '');

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
