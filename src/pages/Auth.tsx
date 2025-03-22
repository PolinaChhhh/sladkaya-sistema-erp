
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import LoginForm from '@/features/auth/components/LoginForm';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">Welcome to Crumb</h2>
            <p className="text-gray-600">Log in to your account</p>
          </div>

          <LoginForm />
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Don't have an account? Contact your administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
