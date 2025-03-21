
import { Recipe } from '../../types';

// Helper function to calculate the cost of a semi-finished product
export function calculateSemiFinalCost(
  recipeId: string,
  requiredAmount: number,
  recipes: Recipe[]
): number {
  // This is a placeholder. In a real system, you would:
  // 1. Get all productions of this semi-finished product
  // 2. Calculate the cost based on FIFO consumption
  // 3. Maintain a record of consumed semi-finished products
  
  // For now, just return a fixed cost per unit
  const recipe = recipes.find(r => r.id === recipeId);
  return recipe ? requiredAmount * 100 : 0; // Default cost of 100 per unit
}
