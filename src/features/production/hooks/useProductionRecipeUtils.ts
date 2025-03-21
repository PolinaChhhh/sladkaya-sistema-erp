
import { useCallback } from 'react';
import { Recipe } from '@/store/types';

export const useProductionRecipeUtils = (recipes: Recipe[]) => {
  // Get recipe name helper
  const getRecipeName = useCallback((recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  }, [recipes]);
  
  // Get recipe output unit helper
  const getRecipeOutput = useCallback((recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  }, [recipes]);
  
  // Get selected recipe
  const getSelectedRecipe = useCallback((recipeId: string | null) => {
    if (!recipeId) return null;
    return recipes.find(r => r.id === recipeId) || null;
  }, [recipes]);

  return {
    getRecipeName,
    getRecipeOutput,
    getSelectedRecipe
  };
};
