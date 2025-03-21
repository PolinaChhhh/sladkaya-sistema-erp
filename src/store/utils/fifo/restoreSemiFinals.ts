
import { Recipe, ProductionBatch } from '../../types';
import { ConsumedSemiFinalItem } from './consumeSemiFinals';

/**
 * Restore semi-final products when updating or deleting a production
 */
export const restoreSemiFinalProductsWithFifo = (
  recipe: Recipe,
  quantity: number,
  productions: ProductionBatch[],
  consumptionDetails: Record<string, ConsumedSemiFinalItem[]> | undefined,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): void => {
  // If we have consumption details, use them for precise restoration
  if (consumptionDetails) {
    // Restore each consumed semi-final item
    Object.values(consumptionDetails).forEach(items => {
      items.forEach(item => {
        const production = productions.find(p => p.id === item.productionId);
        if (production) {
          console.log(`Restoring ${item.amount} of semi-final ${item.name} to production ${item.productionId}`);
          updateProduction(item.productionId, {
            quantity: production.quantity + item.amount
          });
        }
      });
    });
  } else {
    // Fallback to the old method if consumption details aren't available
    const productionRatio = quantity / recipe.output;
    
    // Find all recipe items that are semi-finished products
    recipe.items
      .filter(item => item.type === 'recipe' && item.recipeId)
      .forEach(item => {
        const semiFinalId = item.recipeId as string;
        const amountToRestore = item.amount * productionRatio;
        
        console.log(`Need to restore ${amountToRestore} of semi-final ${semiFinalId}`);
        
        // Find productions of this semi-final with quantity 0
        // We'll restore to the most recent productions first (LIFO for restoration)
        const semiFinalProductions = [...productions]
          .filter(p => p.recipeId === semiFinalId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let remainingToRestore = amountToRestore;
        
        for (const prod of semiFinalProductions) {
          if (remainingToRestore <= 0) break;
          
          // For each production, we need to determine how much was originally produced
          const originalProduction = productions.find(p => p.id === prod.id);
          if (!originalProduction) continue;
          
          // We can restore up to the original quantity
          const restoreAmount = Math.min(remainingToRestore, originalProduction.quantity - prod.quantity);
          
          if (restoreAmount > 0) {
            // Update the production quantity
            console.log(`Restoring ${restoreAmount} of semi-final to production ${prod.id}`);
            updateProduction(prod.id, {
              quantity: prod.quantity + restoreAmount
            });
            
            remainingToRestore -= restoreAmount;
          }
        }
      });
  }
};
