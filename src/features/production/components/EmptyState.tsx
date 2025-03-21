
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon }) => {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-1">Нет данных о производстве</h3>
      <p className="text-gray-500">Добавьте первую запись о производстве, нажав кнопку выше</p>
    </div>
  );
};

export default EmptyState;
