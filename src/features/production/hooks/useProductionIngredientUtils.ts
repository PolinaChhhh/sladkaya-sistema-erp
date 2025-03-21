
import { useCallback } from 'react';
import { ProductionBatch, Recipe } from '@/store/types';

export const useProductionIngredientUtils = (ingredients: any[], recipes: Recipe[]) => {
  // Helper function for ingredient details
  const getIngredientDetails = useCallback((ingredientId: string) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    return ingredient || null;
  }, [ingredients]);
  
  // Helper function for ingredient usage details
  const getIngredientUsageDetails = useCallback((production: ProductionBatch) => {
    if (!production) return [];
    
    const recipe = recipes.find(r => r.id === production.recipeId);
    if (!recipe) return [];
    
    return recipe.items
      .filter(item => item.type === 'ingredient')
      .map(item => {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (!ingredient) return null;
        
        const amountUsed = (item.amount * production.quantity) / recipe.output;
        
        return {
          ingredientId: item.ingredientId,
          name: ingredient.name,
          amount: amountUsed,
          unit: ingredient.unit,
          cost: amountUsed * (ingredient.cost || 0),
          fifoDetails: []
        };
      })
      .filter(Boolean);
  }, [ingredients, recipes]);

  return {
    getIngredientDetails,
    getIngredientUsageDetails
  };
};
