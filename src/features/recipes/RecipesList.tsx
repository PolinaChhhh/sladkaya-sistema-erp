
import React from 'react';
import RecipeCard from './RecipeCard';
import EmptyState from './EmptyState';
import { Recipe, ProductionBatch } from '@/store/types';

interface RecipesListProps {
  recipes: Recipe[];
  productions?: ProductionBatch[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onViewDetails?: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipesList: React.FC<RecipesListProps> = ({ 
  recipes, 
  productions = [],
  onEdit, 
  onDelete,
  onViewDetails,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          productions={productions}
          onEdit={onEdit} 
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
        />
      ))}
    </div>
  );
};

export default RecipesList;
