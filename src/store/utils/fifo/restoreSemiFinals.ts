
import { Recipe, ProductionBatch } from '../../types';
import { ConsumedSemiFinalItem } from './consumeSemiFinals';
import { restoreIngredientsToReceipts } from './restoreIngredients';

/**
 * Restore semi-final products when updating or deleting a production
 */
export const restoreSemiFinalProductsWithFifo = (
  recipe: Recipe,
  quantity: number,
  productions: ProductionBatch[],
  consumptionDetails: Record<string, any[]> | undefined,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  // Adding optional parameters for decomposing semi-finals into ingredients
  recipes?: Recipe[],
  ingredients?: any[],
  receipts?: any[],
  updateIngredient?: (id: string, data: Partial<any>) => void,
  updateReceiptItem?: (receiptId: string, itemId: string, data: Partial<any>) => void,
  shouldDecompose: boolean = false
): void => {
  // If we have consumption details, use them for precise restoration
  if (consumptionDetails) {
    // Restore each consumed semi-final item
    Object.entries(consumptionDetails).forEach(([semiFinalRecipeId, items]) => {
      const semiFinalRecipe = recipes?.find(r => r.id === semiFinalRecipeId);
      
      // Check if these are semi-final items (they have productionId property)
      const hasSemiFinalFormat = items.length > 0 && 'productionId' in items[0];
      
      if (hasSemiFinalFormat) {
        // Cast to ConsumedSemiFinalItem[] since we confirmed it has the right structure
        const semiFinalItems = items as unknown as ConsumedSemiFinalItem[];
        
        semiFinalItems.forEach(item => {
          const production = productions.find(p => p.id === item.productionId);
          if (production) {
            console.log(`Restoring ${item.amount} of semi-final ${item.name} to production ${item.productionId}`);
            
            // If we should decompose the semi-final into ingredients
            if (shouldDecompose && semiFinalRecipe && recipes && ingredients && receipts && updateIngredient && updateReceiptItem) {
              console.log(`Decomposing semi-final ${item.name} into original ingredients`);
              
              // Find the recipe for this semi-final
              const semiFinalRecipeObj = recipes.find(r => r.id === semiFinalRecipeId);
              if (semiFinalRecipeObj) {
                // Restore the ingredients used to create this semi-final
                restoreIngredientsToReceipts(
                  semiFinalRecipeObj,
                  item.amount,
                  ingredients,
                  receipts,
                  updateIngredient,
                  updateReceiptItem
                );
                
                console.log(`Ingredients from semi-final ${item.name} have been restored to inventory`);
              } else {
                console.error(`Could not find recipe for semi-final ${semiFinalRecipeId}`);
              }
            } else {
              // Just restore the production quantity if not decomposing
              console.log(`Not decomposing semi-final, just restoring production quantity ${item.amount} to ${production.id}`);
              updateProduction(item.productionId, {
                quantity: production.quantity + item.amount
              });
            }
          } else {
            console.error(`Could not find production ${item.productionId} to restore semi-final`);
          }
        });
      }
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
        
        const semiFinalRecipe = recipes?.find(r => r.id === semiFinalId);
        
        // If we should decompose and we have all the necessary dependencies
        if (shouldDecompose && semiFinalRecipe && ingredients && receipts && updateIngredient && updateReceiptItem) {
          console.log(`Decomposing semi-final ${semiFinalId} into original ingredients`);
          
          // Restore the ingredients used to create this semi-final
          restoreIngredientsToReceipts(
            semiFinalRecipe,
            amountToRestore,
            ingredients,
            receipts,
            updateIngredient,
            updateReceiptItem
          );
          
          console.log(`Ingredients from semi-final ${semiFinalId} have been restored to inventory`);
          
          // We don't actually restore the semi-final production if we're decomposing it
          return;
        }
        
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
