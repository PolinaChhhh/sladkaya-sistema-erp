
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'readonly';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkComplete, setCheckComplete] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Добавляем логирование для отладки
  useEffect(() => {
    console.log('AuthGuard - user:', user, 'profile:', profile, 'isLoading:', isLoading);
  }, [user, profile, isLoading]);

  useEffect(() => {
    if (!isLoading || loadingTimeout) {
      if (!user) {
        console.log('No user found, redirecting to /auth');
        navigate('/auth', { state: { from: location.pathname } });
      } else if (requiredRole) {
        // Check role-based access
        const userRole = profile?.role || 'readonly';
        console.log('Checking role access - required:', requiredRole, 'user has:', userRole);
        
        if (
          (requiredRole === 'admin' && userRole !== 'admin') ||
          (requiredRole === 'manager' && !['admin', 'manager'].includes(userRole))
        ) {
          // Not enough permissions
          console.log('Insufficient permissions, redirecting to /unauthorized');
          navigate('/unauthorized');
        }
      }
      setCheckComplete(true);
    }
  }, [user, profile, isLoading, navigate, location.pathname, requiredRole, loadingTimeout]);

  // Добавляем таймаут, чтобы не зависать бесконечно в состоянии загрузки
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        console.log('AuthGuard loading timeout reached');
        setLoadingTimeout(true);
        setCheckComplete(true);
      }, 3000); // Уменьшаем таймаут до 3 секунд
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-confection-500"></div>
      </div>
    );
  }

  return checkComplete && user ? <>{children}</> : null;
};

export default AuthGuard;
