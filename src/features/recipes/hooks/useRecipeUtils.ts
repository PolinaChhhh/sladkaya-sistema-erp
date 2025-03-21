
import { Recipe, Ingredient } from '@/store/types';

export const useRecipeUtils = (recipes: Recipe[], ingredients: Ingredient[]) => {
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };

  const getRecipeName = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeUnit = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    return recipe ? recipe.outputUnit : '';
  };

  return {
    getIngredientName,
    getIngredientUnit,
    getRecipeName,
    getRecipeUnit
  };
};
