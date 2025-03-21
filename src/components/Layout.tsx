
import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/features/auth/AuthContext';
import AuthGuard from '@/features/auth/components/AuthGuard';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'manager' | 'readonly';
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole 
}) => {
  const { isLoading, user } = useAuth();

  // Добавляем логирование для отладки
  useEffect(() => {
    console.log('Layout render - isLoading:', isLoading, 'user:', user);
  }, [isLoading, user]);

  // Проверяем, не застрял ли компонент в состоянии загрузки
  if (isLoading) {
    // Добавляем таймаут, чтобы не зависать бесконечно в состоянии загрузки
    setTimeout(() => {
      console.log('Loading timeout reached');
    }, 5000);

    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-confection-500"></div>
      </div>
    );
  }

  if (requireAuth) {
    return (
      <AuthGuard requiredRole={requiredRole}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <Navbar />
          <main className="container pt-24 pb-16 px-4 md:px-6 animate-page-transition">
            {children}
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {requireAuth && <Navbar />}
      <main className={`container ${requireAuth ? 'pt-24' : ''} pb-16 px-4 md:px-6 animate-page-transition`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
