
import { ProductionBatch, Recipe } from '../../../types';
import { restoreIngredientsToReceipts } from '../../../utils/fifo/restoreIngredients';
import { restoreSemiFinalProductsWithFifo } from '../../../utils/fifo/restoreSemiFinals';

/**
 * Handles deleting a production batch
 */
export const handleDeleteProduction = (
  id: string,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): void => {
  const production = productions.find(p => p.id === id);
  
  if (!production) {
    console.error('Production not found');
    return;
  }
  
  const recipe = recipes.find(r => r.id === production.recipeId);
  
  if (recipe) {
    // Restore ingredients to receipts
    restoreIngredientsToReceipts(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Restore semi-finished products using FIFO details if available
    restoreSemiFinalProductsWithFifo(
      recipe,
      production.quantity,
      productions,
      production.semiFinalConsumptionDetails,
      updateProduction
    );
  }
};
