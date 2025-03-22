
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from '../types';
import { useUserProfile } from './useUserProfile';

export const useAuthState = (): AuthState & { 
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch profile using the custom hook
  const { profile } = useUserProfile(user?.id);
  
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      try {
        // First check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isMounted) {
          console.log('Existing session found:', session.user.id);
          setUser(session.user);
          setSession(session);
        } else if (isMounted) {
          console.log('No session found');
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session && isMounted) {
          setUser(session.user);
          setSession(session);
        } else if (isMounted) {
          setUser(null);
          setSession(null);
        }
      }
    );

    // Таймаут безопасности на случай, если состояние загрузки зависнет
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log('Safety timeout triggered: resetting loading state');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in:', email);
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error; // Прокидываем ошибку, чтобы форма могла её обработать
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    user, 
    session, 
    profile, 
    isLoading,
    signIn,
    signOut
  };
};
