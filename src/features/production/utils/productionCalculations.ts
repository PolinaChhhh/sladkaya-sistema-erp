
import { Recipe, Ingredient } from '@/store/types';

/**
 * Calculate the cost of producing a recipe
 */
export const calculateCost = (recipe: Recipe, quantity: number, ingredients: Ingredient[]): number => {
  // Sum up the cost of all ingredients
  let totalCost = 0;
  const ratio = quantity / recipe.output;
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        totalCost += ingredient.cost * item.amount * ratio;
      }
    } else if (item.type === 'recipe' && item.recipeId) {
      // For semi-finals, recursively calculate their cost
      const semiRecipe = recipes.find(r => r.id === item.recipeId);
      if (semiRecipe) {
        const semiCost = calculateCost(semiRecipe, 1, ingredients); // Cost for one unit
        totalCost += semiCost * item.amount * ratio;
      }
    }
  });
  
  return totalCost;
};

/**
 * Get the detailed breakdown of ingredients used for a recipe
 */
export const getIngredientDetails = (
  recipes: Recipe[], 
  recipeId: string, 
  quantity: number,
  allIngredients: Ingredient[]
) => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return [];
  
  const ratio = quantity / recipe.output;
  const details: {
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
    cost: number;
  }[] = [];
  
  // Process each recipe item
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = allIngredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        details.push({
          ingredientId: item.ingredientId,
          name: ingredient.name,
          amount: item.amount * ratio,
          unit: ingredient.unit,
          cost: item.amount * ratio * ingredient.cost
        });
      }
    } else if (item.type === 'recipe' && item.recipeId) {
      // For semi-finals, recursively get their ingredients
      const semiRecipe = recipes.find(r => r.id === item.recipeId);
      if (semiRecipe) {
        const semiDetails = getIngredientDetails(
          recipes, 
          item.recipeId, 
          item.amount * ratio,
          allIngredients
        );
        details.push(...semiDetails);
      }
    }
  });
  
  return details;
};
