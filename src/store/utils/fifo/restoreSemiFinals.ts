
import { ProductionBatch, Recipe } from '../../types';
import { restoreIngredientsToReceipts } from './restoreIngredients';

/**
 * Restore semi-finished products using FIFO details
 * If shouldDecompose is true, the semi-finals will be decomposed into their ingredients
 */
export const restoreSemiFinalProductsWithFifo = (
  recipe: Recipe,
  productionQuantity: number,
  productions: ProductionBatch[],
  consumptionDetails: Record<string, any[]>,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  shouldDecompose: boolean
): void => {
  console.log(`Restoring semi-finals for recipe ${recipe.name}, shouldDecompose=${shouldDecompose}`);
  
  // Process only recipe items that are semi-finals
  recipe.items
    .filter(item => item.type === 'recipe')
    .forEach(item => {
      const recipeId = item.recipeId;
      
      if (!recipeId) return;
      
      // Check if we have consumption details for this semi-final
      if (consumptionDetails && consumptionDetails[recipeId]) {
        console.log(`Found semi-final consumption details for recipe ${recipeId}`);
        
        // Get the consumption details for this semi-final
        const usedProductions = consumptionDetails[recipeId];
        
        // Process each production that was consumed
        usedProductions.forEach(usedProduction => {
          const { productionId, amount } = usedProduction;
          
          // Find the production that was used
          const semiFinalProduction = productions.find(p => p.id === productionId);
          
          if (!semiFinalProduction) {
            console.warn(`Production ${productionId} not found - it may have been already deleted. Skipping restoration.`);
            return; // Skip this production but continue with others
          }
          
          // Update the quantity of the semi-final production
          // We're using the 'quantity' property which exists in ProductionBatch
          // instead of 'availableQuantity' which doesn't exist
          updateProduction(productionId, {
            quantity: semiFinalProduction.quantity + amount
          });
          
          console.log(`Restored ${amount} to semi-final production ${productionId}`);
          
          // If we should decompose, we need to restore the ingredients of the semi-final
          if (shouldDecompose) {
            const semiFinalRecipe = recipes.find(r => r.id === semiFinalProduction.recipeId);
            
            if (!semiFinalRecipe) {
              console.error(`Semi-final recipe not found: ${semiFinalProduction.recipeId}`);
              return;
            }
            
            // Get the consumption details of this semi-final production
            const semiFinalConsumptionDetails = semiFinalProduction.consumptionDetails;
            
            console.log(`Decomposing semi-final ${semiFinalRecipe.name}, has consumption details: ${!!semiFinalConsumptionDetails}`);
            
            // Restore the direct ingredients using consumption details if available
            restoreIngredientsToReceipts(
              semiFinalRecipe,
              amount,  // Only restore based on the amount we're restoring
              ingredients,
              receipts,
              updateIngredient,
              updateReceiptItem,
              semiFinalConsumptionDetails
            );
          }
        });
      } else {
        console.log(`No consumption details found for semi-final recipeId=${recipeId}`);
      }
    });
};
