
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useRoleChecks } from './hooks/useRoleChecks';

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
  const { user, session, profile, isLoading, signIn: baseSignIn, signOut: baseSignOut } = useAuthState();
  const { isAdmin, isManager } = useRoleChecks(profile);
  const navigate = useNavigate();

  const enhancedSignIn = async (email: string, password: string) => {
    try {
      await baseSignIn(email, password);
      toast.success('Успешно вошли в систему');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Не удалось войти в систему');
      throw error;
    }
  };

  const enhancedSignOut = async () => {
    try {
      await baseSignOut();
      toast.success('Вы успешно вышли из системы');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Не удалось выйти из системы');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      isLoading, 
      signIn: enhancedSignIn, 
      signOut: enhancedSignOut,
      isAdmin,
      isManager
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
