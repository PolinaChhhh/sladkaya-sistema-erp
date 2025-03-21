
import { useCallback } from 'react';
import { Recipe, Ingredient, Receipt } from '@/store/types';
import { simulateFifoConsumption } from '../utils/fifoCalculator';

export const useProductionCostCalculation = (
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[] = []
) => {
  // Calculate cost helper
  const calculateCost = useCallback((recipeId: string, quantity: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    const productionRatio = quantity / recipe.output;
    let totalCost = 0;
    
    // Calculate cost of ingredients using FIFO method
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const amountNeeded = item.amount * productionRatio;
        
        // Use FIFO cost simulation for accurate costs
        const simulation = simulateFifoConsumption(
          item.ingredientId,
          amountNeeded, 
          receipts
        );
        
        totalCost += simulation.totalCost;
      } else if (item.type === 'recipe' && item.recipeId) {
        // For semi-finished products, calculate recursively
        const amountNeeded = item.amount * productionRatio;
        totalCost += calculateCost(item.recipeId, amountNeeded);
      }
    });
    
    return totalCost;
  }, [recipes, ingredients, receipts]);

  // Get detailed cost breakdown for a recipe
  const getIngredientCostBreakdown = useCallback((recipeId: string, quantity: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    const productionRatio = quantity / recipe.output;
    const breakdown = [];
    
    for (const item of recipe.items) {
      if (item.type === 'ingredient' && item.ingredientId) {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (!ingredient) continue;
        
        const amountNeeded = item.amount * productionRatio;
        
        // Use FIFO simulation to get detailed cost breakdown
        const simulation = simulateFifoConsumption(
          item.ingredientId,
          amountNeeded,
          receipts
        );
        
        breakdown.push({
          ingredientId: item.ingredientId,
          name: ingredient.name,
          amount: amountNeeded,
          unit: ingredient.unit,
          totalCost: simulation.totalCost,
          receiptItems: simulation.breakdown.map(b => ({
            receiptId: b.receiptId,
            receiptDate: b.receiptDate,
            receiptReference: b.receiptReference,
            amountUsed: b.amountUsed,
            unitPrice: b.unitPrice,
            totalPrice: b.totalPrice
          }))
        });
      }
    }
    
    return breakdown;
  }, [recipes, ingredients, receipts]);

  return {
    calculateCost,
    getIngredientCostBreakdown
  };
};
