
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
    console.log(`Deleting production ${id} of recipe ${recipe.name}`);
    
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
    // IMPORTANT: We do NOT decompose semi-finals into ingredients here
    // We just return them to stock so they can be used in other productions
    restoreSemiFinalProductsWithFifo(
      recipe,
      production.quantity,
      productions,
      // Safe casting the consumption details to the expected type
      production.consumptionDetails as unknown as Record<string, any[]>,
      updateProduction,
      recipes,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem,
      false // Set to false to NOT decompose semi-finals into ingredients
    );
    
    console.log(`Production ${id} has been deleted and all ingredients/semi-finals have been restored`);
  }
};
