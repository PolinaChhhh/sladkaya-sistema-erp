
import { ProductionBatch, Recipe } from '../../../types';
import { consumeIngredientsWithFifo } from '../../../utils/fifo/consumeIngredients';
import { restoreIngredientsToReceipts } from '../../../utils/fifo/restoreIngredients';
import { consumeSemiFinalProductsWithFifo } from '../../../utils/fifo/consumeSemiFinals';
import { restoreSemiFinalProductsWithFifo } from '../../../utils/fifo/restoreSemiFinals';

/**
 * Handles updating an existing production batch
 */
export const handleUpdateProduction = (
  id: string,
  data: Partial<ProductionBatch>,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): Partial<ProductionBatch> => {
  const originalProduction = productions.find(p => p.id === id);
  
  if (!originalProduction) {
    console.error('Production not found');
    return data;
  }
  
  // If quantity changed, recalculate ingredient consumption
  if (data.quantity && data.quantity !== originalProduction.quantity) {
    const recipe = recipes.find(r => r.id === originalProduction.recipeId);
    
    if (recipe) {
      console.log(`Updating production ${id} quantity from ${originalProduction.quantity} to ${data.quantity}`);
      
      // First restore the original ingredients
      restoreIngredientsToReceipts(
        recipe,
        originalProduction.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // Also restore semi-finished products using FIFO details if available
      // Do not decompose for update - we need to reuse these semi-finals
      restoreSemiFinalProductsWithFifo(
        recipe,
        originalProduction.quantity,
        productions,
        originalProduction.semiFinalConsumptionDetails,
        updateProduction,
        recipes,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem,
        false // Set to false for updates as we don't want to decompose
      );
      
      // Then consume the new amount of ingredients
      const { totalCost: ingredientCost, consumptionDetails } = consumeIngredientsWithFifo(
        recipe,
        data.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // And consume new amount of semi-finished products using FIFO
      const { totalCost: semiFinalCost, consumptionDetails: semiFinalConsumptionDetails } = 
        consumeSemiFinalProductsWithFifo(
          recipe,
          data.quantity,
          recipes,
          productions,
          updateProduction
        );
      
      // Update the cost along with other changes
      const totalCost = ingredientCost + semiFinalCost;
      data.cost = totalCost;
      data.consumptionDetails = consumptionDetails;
      data.semiFinalConsumptionDetails = semiFinalConsumptionDetails;
    }
  }
  
  return data;
};

