
import { Recipe, Ingredient } from '@/store/types';

/**
 * Calculate the total cost of a recipe including both ingredients and semi-finished products
 * @param recipes Array of all recipes
 * @param recipeId ID of the recipe to calculate for
 * @param quantity Quantity of the recipe to produce
 * @param ingredients Array of all ingredients
 * @returns Total cost of the recipe
 */
export const calculateTotalCost = (
  recipes: Recipe[],
  recipeId: string,
  quantity: number,
  ingredients: Ingredient[]
): number => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return 0;

  let totalCost = 0;
  const ratio = quantity / recipe.output;

  // Calculate cost of ingredients
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (ingredient) {
        totalCost += (item.amount * ratio) * ingredient.cost;
      }
    });

  // Calculate cost of semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiRecipeId = item.recipeId as string;
      const semiRecipe = recipes.find(r => r.id === semiRecipeId);
      if (semiRecipe) {
        // Recursively calculate the cost of the semi-finished product
        const semiAmount = item.amount * ratio;
        const semiCost = calculateTotalCost(recipes, semiRecipeId, semiAmount, ingredients);
        totalCost += semiCost;
      }
    });

  return totalCost;
};
