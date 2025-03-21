
import { Recipe } from '@/store/types';

export const getRecipeName = (recipeId: string, recipes: Recipe[]): string => {
  const recipe = recipes.find(r => r.id === recipeId);
  return recipe ? recipe.name : 'Неизвестный рецепт';
};

export const getRecipeOutput = (recipeId: string, recipes: Recipe[]): string => {
  const recipe = recipes.find(r => r.id === recipeId);
  return recipe ? recipe.outputUnit : '';
};

export const getSelectedRecipe = (
  selectedProductionId: string | null,
  productions: any[],
  recipes: Recipe[]
): Recipe | null => {
  if (!selectedProductionId) return null;
  const production = productions.find(p => p.id === selectedProductionId);
  if (!production) return null;
  return recipes.find(r => r.id === production.recipeId) || null;
};
