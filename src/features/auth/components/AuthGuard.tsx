
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth', { state: { from: location.pathname } });
      } else if (requiredRole) {
        // Check role-based access
        const userRole = profile?.role || 'readonly';
        
        if (
          (requiredRole === 'admin' && userRole !== 'admin') ||
          (requiredRole === 'manager' && !['admin', 'manager'].includes(userRole))
        ) {
          // Not enough permissions
          navigate('/unauthorized');
        }
      }
    }
  }, [user, profile, isLoading, navigate, location.pathname, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-confection-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default AuthGuard;
