
import React from 'react';
import { ChefHat, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = ChefHat,
  title = "Нет рецептов",
  description = "Создайте ваш первый рецепт, чтобы начать"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-center">
      <div className="p-4 bg-confection-100 rounded-full mb-4">
        <Icon className="h-8 w-8 text-confection-700" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;
