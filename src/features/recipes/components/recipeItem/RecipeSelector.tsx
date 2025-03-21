
import React from 'react';
import { Recipe } from '@/store/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipeSelectorProps {
  recipeId: string;
  recipes: Recipe[];
  onRecipeChange: (id: string) => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  recipeId,
  recipes,
  onRecipeChange
}) => {
  return (
    <Select
      value={recipeId || ''}
      onValueChange={onRecipeChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите полуфабрикат" />
      </SelectTrigger>
      <SelectContent>
        {recipes
          .filter(recipe => recipe.category === 'semi-finished')
          .map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id}>
              {recipe.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default RecipeSelector;
