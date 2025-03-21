
import { Recipe, ProductionBatch } from '../types';

/**
 * Consumes semi-final products from virtual stock using FIFO accounting
 * @returns The total cost of consumed semi-final products
 */
export function consumeSemiFinalProducts(
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[],
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): number {
  let totalSemiFinalCost = 0;
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
      
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Calculate available quantity of this semi-finished product
        const availableQuantity = productions
          .filter(p => p.recipeId === semiFinalId)
          .reduce((total, p) => total + p.quantity, 0);
        
        if (availableQuantity < amountNeeded) {
          console.warn(`Not enough ${semiFinalRecipe.name} available. Need ${amountNeeded}, have ${availableQuantity}`);
          return;
        }
        
        // Consume from productions using FIFO (oldest first)
        const semiFinalProductions = [...productions]
          .filter(p => p.recipeId === semiFinalId && p.quantity > 0)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let remainingToConsume = amountNeeded;
        
        for (const prod of semiFinalProductions) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, prod.quantity);
          
          // Calculate cost for this portion
          const unitCost = prod.cost / prod.quantity;
          const consumeCost = consumeAmount * unitCost;
          
          // Add to total cost
          totalSemiFinalCost += consumeCost;
          
          // Update the production quantity
          updateProduction(prod.id, {
            quantity: prod.quantity - consumeAmount
          });
          
          remainingToConsume -= consumeAmount;
        }
      }
    });
  
  return totalSemiFinalCost;
}

/**
 * Restores semi-final products when updating or deleting a production
 */
export function restoreSemiFinalProducts(
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[],
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): void {
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const amountToRestore = item.amount * productionRatio;
      
      // Find the most recent production of this semi-final with quantity 0
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
          updateProduction(prod.id, {
            quantity: prod.quantity + restoreAmount
          });
          
          remainingToRestore -= restoreAmount;
        }
      }
    });
}
