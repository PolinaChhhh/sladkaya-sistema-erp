
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-lg w-full text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
        <h1 className="text-2xl font-bold mb-2">Доступ запрещен</h1>
        <p className="text-gray-600 mb-6">
          У вас нет прав для доступа к этой странице. Пожалуйста, свяжитесь с администратором, если вы считаете, что это ошибка.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/')} variant="outline">
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
