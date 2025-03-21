
import { Recipe, Ingredient } from '@/store/types';

/**
 * Calculate ingredient details for a recipe
 * @param recipes Array of all recipes
 * @param recipeId ID of the recipe to calculate for
 * @param quantity Quantity of the recipe to produce
 * @param ingredients Array of all ingredients
 * @returns Array of ingredient usage details
 */
export const getIngredientDetails = (
  recipes: Recipe[], 
  recipeId: string, 
  quantity: number,
  ingredients: Ingredient[]
) => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return [];

  return recipe.ingredients.map(item => {
    const ingredient = ingredients.find(i => i.id === item.ingredientId);
    const amount = (item.amount * quantity) / recipe.outputQuantity;
    
    return {
      ingredientId: item.ingredientId,
      name: ingredient ? ingredient.name : 'Неизвестный ингредиент',
      amount: amount,
      unit: ingredient ? ingredient.unit : '',
      cost: amount * (ingredient ? ingredient.price : 0)
    };
  });
};
