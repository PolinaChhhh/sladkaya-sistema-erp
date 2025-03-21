
import { ProductionBatch, Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';
import { restoreIngredientsToReceipts } from '../../utils/fifoCalculator';

export const deleteProductionBatch = (
  id: string,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): ProductionBatch[] => {
  const productionToDelete = productions.find(p => p.id === id);
  
  if (productionToDelete) {
    // Get the recipe for this production
    const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
    
    if (recipe) {
      // Restore ingredients and update receipt items
      restoreIngredientsToReceipts(
        recipe,
        productionToDelete.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
    }
  }
  
  // Remove the production
  return productions.filter((production) => production.id !== id);
};
