
import { Recipe } from '../../types';

/**
 * Calculate the amount of each ingredient needed for a production
 */
export const calculateIngredientsNeeded = (
  recipe: Recipe,
  quantity: number
): { ingredientId: string; amountNeeded: number }[] => {
  const productionRatio = quantity / recipe.output;
  
  return recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .map(item => ({
      ingredientId: item.ingredientId as string,
      amountNeeded: item.amount * productionRatio
    }));
};
