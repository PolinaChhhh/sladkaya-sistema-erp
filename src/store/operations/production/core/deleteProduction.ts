
import { ProductionBatch, Recipe } from '../../../types';
import { restoreIngredientsToReceipts } from '../../../utils/fifo/restoreIngredients';

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
  // Ensure id is a string for consistent comparison
  const idStr = String(id);
  
  const production = productions.find(p => String(p.id) === idStr);
  
  if (!production) {
    console.error(`Production not found: ${idStr}`);
    return;
  }
  
  const recipe = recipes.find(r => String(r.id) === String(production.recipeId));
  
  if (!recipe) {
    console.error(`Recipe not found: ${production.recipeId}`);
    return;
  }
  
  console.log(`Deleting production ${idStr} of recipe ${recipe.name}`);
  console.log(`Production has consumptionDetails: ${!!production.consumptionDetails}`);
  if (production.consumptionDetails) {
    console.log(`Consumption details keys: ${Object.keys(production.consumptionDetails).join(', ')}`);
  }
  
  // Restore ingredients to receipts
  restoreIngredientsToReceipts(
    recipe,
    production.quantity,
    ingredients,
    receipts,
    updateIngredient,
    updateReceiptItem,
    production.consumptionDetails // Pass consumption details for precise restoration
  );
  
  console.log(`Production ${idStr} has been deleted and ingredients have been returned to stock`);
};
