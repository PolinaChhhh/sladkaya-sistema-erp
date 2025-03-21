
import { ProductionBatch, Recipe } from '../../../types';
import { restoreIngredientsToReceipts } from '../../../utils/fifo/restoreIngredients';
import { restoreSemiFinalProducts } from '../../../utils/semiFinalProductUtils';

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
  const productionToDelete = productions.find(p => p.id === id);
  
  if (!productionToDelete) {
    console.error('Production not found');
    return;
  }
  
  const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
  
  if (recipe) {
    // Restore ingredients back to receipts
    restoreIngredientsToReceipts(
      recipe,
      productionToDelete.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Restore semi-finished products
    restoreSemiFinalProducts(
      recipe,
      productionToDelete.quantity,
      recipes,
      productions,
      updateProduction
    );
  }
};
