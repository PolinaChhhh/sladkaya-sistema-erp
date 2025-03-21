
import React from 'react';
import { RecipeCategory } from '@/store/types';

interface EmptyItemsMessageProps {
  category: RecipeCategory;
}

const EmptyItemsMessage: React.FC<EmptyItemsMessageProps> = ({ category }) => {
  return (
    <p className="text-sm text-gray-500 py-2">
      {category === 'finished' 
        ? 'Нет добавленных ингредиентов' 
        : 'Нет добавленных компонентов'}
    </p>
  );
};

export default EmptyItemsMessage;
