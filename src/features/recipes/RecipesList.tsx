
import React from 'react';
import RecipeCard from './RecipeCard';
import EmptyState from './EmptyState';
import { Recipe } from '@/store/recipeStore';

interface RecipesListProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
}

const RecipesList: React.FC<RecipesListProps> = ({ 
  recipes, 
  onEdit, 
  onDelete,
  getIngredientName,
  getIngredientUnit
}) => {
  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
        />
      ))}
    </div>
  );
};

export default RecipesList;
