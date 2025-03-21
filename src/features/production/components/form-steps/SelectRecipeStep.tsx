
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recipe } from '@/store/recipeStore';

interface SelectRecipeStepProps {
  recipes: Recipe[];
  selectedRecipeId: string;
  onRecipeChange: (recipeId: string) => void;
}

const SelectRecipeStep: React.FC<SelectRecipeStepProps> = ({
  recipes,
  selectedRecipeId,
  onRecipeChange
}) => {
  // Only show finished products for selection
  const finishedRecipes = recipes.filter(r => r.category === 'finished');
  
  return (
    <div>
      <Label htmlFor="recipe">Продукт</Label>
      <Select
        value={selectedRecipeId}
        onValueChange={onRecipeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите продукт" />
        </SelectTrigger>
        <SelectContent>
          {finishedRecipes.map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id}>
              {recipe.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectRecipeStep;
