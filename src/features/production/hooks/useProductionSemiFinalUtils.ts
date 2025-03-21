
import { useCallback } from 'react';
import { ProductionBatch, Recipe } from '@/store/types';

export const useProductionSemiFinalUtils = (
  recipes: Recipe[],
  calculateCost: (recipeId: string, quantity: number) => number
) => {
  // Helper function for semi-final breakdown
  const getSemiFinalBreakdown = useCallback((production: ProductionBatch) => {
    if (!production) return [];
    
    const recipe = recipes.find(r => r.id === production.recipeId);
    if (!recipe) return [];
    
    return recipe.items
      .filter(item => item.type === 'recipe' && item.recipeId)
      .map(item => {
        const amountUsed = (item.amount * production.quantity) / recipe.output;
        
        return {
          recipeId: item.recipeId as string,
          amount: amountUsed,
          cost: calculateCost(item.recipeId as string, amountUsed)
        };
      });
  }, [recipes, calculateCost]);

  return {
    getSemiFinalBreakdown
  };
};
