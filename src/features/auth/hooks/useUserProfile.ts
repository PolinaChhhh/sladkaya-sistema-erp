
import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useUserProfile = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchUserProfile = async () => {
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
            setProfile({
              ...profile,
              role: 'readonly' as UserProfile['role'],
            } as UserProfile);
            setIsLoading(false);
            return;
          }
          
          throw roleError;
        }

        console.log('Role fetched:', roleData);

        setProfile({
          ...profile,
          role: roleData.role as UserProfile['role'],
        } as UserProfile);
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        // Return a default profile with readonly role
        setProfile({
          id: userId,
          role: 'readonly',
          full_name: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email: null,
        } as UserProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { profile, isLoading };
};
