
import React from 'react';
import { Box } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Box className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-1">Нет ингредиентов</h3>
      <p className="text-gray-500">Добавьте свой первый ингредиент, нажав кнопку выше</p>
    </div>
  );
};

export default EmptyState;
