
import { useCallback } from 'react';
import { Recipe } from '@/store/types';

export const useProductionCostCalculation = (
  recipes: Recipe[],
  ingredients: any[]
) => {
  // Calculate cost helper
  const calculateCost = useCallback((recipeId: string, quantity: number) => {
    // Simple cost calculation (can be improved with proper FIFO logic)
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    let totalCost = 0;
    
    recipe.items.forEach(item => {
      if (item.type === 'ingredient') {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (ingredient) {
          // Calculate based on average cost 
          const amountNeeded = (item.amount * quantity) / recipe.output;
          totalCost += amountNeeded * (ingredient.cost || 0);
        }
      } else if (item.type === 'recipe' && item.recipeId) {
        // For semi-finished products, calculate recursively
        const amountNeeded = (item.amount * quantity) / recipe.output;
        totalCost += calculateCost(item.recipeId, amountNeeded);
      }
    });
    
    return totalCost;
  }, [recipes, ingredients]);

  return {
    calculateCost
  };
};
