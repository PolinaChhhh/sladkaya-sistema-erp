
import React from 'react';
import { Ingredient } from '@/store/types';
import IngredientTable from './IngredientTable';
import SemiFinalIngredientTable from './SemiFinalIngredientTable';
import EmptyState from './EmptyState';

interface IngredientsContentProps {
  regularIngredients: Ingredient[];
  semiFinalIngredients: Ingredient[];
  searchQuery: string;
  ingredientTypeFilter: string;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

const IngredientsContent: React.FC<IngredientsContentProps> = ({
  regularIngredients,
  semiFinalIngredients,
  searchQuery,
  ingredientTypeFilter,
  onEdit,
  onDelete
}) => {
  return (
    <>
      {regularIngredients.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ингредиенты</h2>
          <IngredientTable 
            ingredients={regularIngredients} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>
      ) : (
        searchQuery === '' && ingredientTypeFilter === 'all' ? (
          <EmptyState />
        ) : (
          <div className="glass rounded-xl p-6 text-center my-4">
            <p className="text-gray-500">Нет ингредиентов, соответствующих вашему запросу</p>
          </div>
        )
      )}
      
      {semiFinalIngredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Полуфабрикаты</h2>
          <SemiFinalIngredientTable
            ingredients={semiFinalIngredients}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
};

export default IngredientsContent;
