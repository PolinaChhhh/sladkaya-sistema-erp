
import { Recipe } from '@/store/types';

export const useProductionUtils = (recipes: Recipe[]) => {
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  return {
    getRecipeName,
    getRecipeOutput
  };
};
