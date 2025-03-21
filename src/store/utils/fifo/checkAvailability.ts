
import { Recipe, Ingredient } from '../../types';

/**
 * Check if there are sufficient ingredients and semi-finished products for a production
 */
export const checkIngredientsAvailability = (
  recipe: Recipe | undefined,
  quantity: number,
  ingredients: Ingredient[],
  recipes?: Recipe[],
  productions?: any[],
  autoProduceSemiFinals: boolean = false // Parameter to skip semi-final checks
): { canProduce: boolean; insufficientIngredients: string[] } => {
  if (!recipe) {
    return { canProduce: false, insufficientIngredients: ['Recipe not found'] };
  }
  
  const productionRatio = quantity / recipe.output;
  let canProduce = true;
  const insufficientIngredients: string[] = [];
  
  // Check regular ingredients
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * productionRatio;
        if (ingredient.quantity < amountNeeded) {
          canProduce = false;
          insufficientIngredients.push(ingredient.name);
        }
      }
    } else if (item.type === 'recipe' && item.recipeId && recipes && productions && !autoProduceSemiFinals) {
      // Check semi-finished products only if we're not auto-producing them
      const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Calculate available quantity of this semi-finished product
        const availableQuantity = productions
          .filter(p => p.recipeId === item.recipeId)
          .reduce((total, p) => total + p.quantity, 0);
        
        if (availableQuantity < amountNeeded) {
          canProduce = false;
          insufficientIngredients.push(semiFinalRecipe.name);
        }
      }
    }
  });
  
  return { canProduce, insufficientIngredients };
};
