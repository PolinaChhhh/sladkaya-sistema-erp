
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
      console.log('Fetching user profile for ID:', userId);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        
        // If profile not found, we might want to create one
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, may need to be created');
        }
        
        throw profileError;
      }

      console.log('Profile fetched:', profile);

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Role fetch error:', roleError);
        
        // If role not found, assign default readonly role
        if (roleError.code === 'PGRST116') {
          console.log('Role not found, using default readonly');
          return {
            ...profile,
            role: 'readonly' as UserProfile['role'],
          } as UserProfile;
        }
        
        throw roleError;
      }

      console.log('Role fetched:', roleData);

      return {
        ...profile,
        role: roleData.role as UserProfile['role'],
      } as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Return a default profile with readonly role
      return {
        id: userId,
        role: 'readonly',
        full_name: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: state.user?.email || null,
      } as UserProfile;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      try {
        // First check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
          });
        } else {
          console.log('No session found');
          setState({ ...initialState, isLoading: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({ ...initialState, isLoading: false });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session) {
          try {
            const profile = await fetchUserProfile(session.user.id);
            setState({
              user: session.user,
              session,
              profile,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error during auth state change:', error);
            setState({
              user: session.user,
              session,
              profile: null,
              isLoading: false,
            });
          }
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
      console.log('Signing in:', email);
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
        toast.success('Успешно вошли в систему');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Не удалось войти в систему');
      setState({ ...state, isLoading: false });
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      setState({ ...state, isLoading: true });
      await supabase.auth.signOut();
      setState({ ...initialState, isLoading: false });
      toast.success('Вы успешно вышли из системы');
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Не удалось выйти из системы');
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
