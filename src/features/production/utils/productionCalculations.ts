
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

  return recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .map(item => {
      const ingredientId = item.ingredientId as string;
      const ingredient = ingredients.find(i => i.id === ingredientId);
      const amount = (item.amount * quantity) / recipe.output;
      
      return {
        ingredientId: ingredientId,
        name: ingredient ? ingredient.name : 'Неизвестный ингредиент',
        amount: amount,
        unit: ingredient ? ingredient.unit : '',
        cost: amount * (ingredient ? ingredient.cost : 0)
      };
    });
};
