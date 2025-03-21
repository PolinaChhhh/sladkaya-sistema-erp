
import { Recipe, ProductionBatch } from '../../types';

// Track which production batches were consumed for a specific production
export interface ConsumedSemiFinalItem {
  productionId: string;
  recipeId: string;
  name: string;
  amount: number;
  unitCost: number;
  date: string;
}

/**
 * Consume semi-final products using FIFO and calculate cost
 */
export const consumeSemiFinalProductsWithFifo = (
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[],
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): { totalCost: number; consumptionDetails: Record<string, ConsumedSemiFinalItem[]> } => {
  const productionRatio = quantity / recipe.output;
  let totalCost = 0;
  
  // Track which production batches were consumed for each semi-final
  const consumptionDetails: Record<string, ConsumedSemiFinalItem[]> = {};
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
      
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Initialize the consumption tracking for this semi-final
        consumptionDetails[semiFinalId] = [];
        
        // Get all production batches for this semi-final, sorted by date (oldest first)
        const semiFinalProductions = [...productions]
          .filter(p => p.recipeId === semiFinalId && p.quantity > 0)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let remainingToConsume = amountNeeded;
        let semiFinalCost = 0;
        
        for (const prod of semiFinalProductions) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, prod.quantity);
          
          // Calculate the cost for this portion using the production's unit cost
          const unitCost = prod.cost / prod.quantity;
          const portionCost = consumeAmount * unitCost;
          semiFinalCost += portionCost;
          
          // Track this consumption
          consumptionDetails[semiFinalId].push({
            productionId: prod.id,
            recipeId: semiFinalId,
            name: semiFinalRecipe.name,
            amount: consumeAmount,
            unitCost: unitCost,
            date: prod.date
          });
          
          // Update the production quantity
          updateProduction(prod.id, {
            quantity: prod.quantity - consumeAmount
          });
          
          remainingToConsume -= consumeAmount;
        }
        
        // Add the cost of this semi-final to the total cost
        totalCost += semiFinalCost;
      }
    });
  
  return { totalCost, consumptionDetails };
};
