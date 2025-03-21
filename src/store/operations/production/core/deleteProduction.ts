
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
  
  console.log(`Deleting production ${idStr} of recipe ${recipe.name} (category: ${recipe.category})`);
  console.log(`Production has consumptionDetails: ${!!production.consumptionDetails}`);
  if (production.consumptionDetails) {
    console.log(`Consumption details keys: ${Object.keys(production.consumptionDetails).join(', ')}`);
  }
  
  // Check if this is a semi-finished or a finished product
  const isSemiFinished = recipe.category === 'semi-finished';
  
  // Always restore direct ingredients to receipts for any production containing ingredients
  // This handles both packaging materials for finished products and all ingredients for semi-finished products
  console.log(`Restoring direct ingredients for ${recipe.name} (semi-finished: ${isSemiFinished})`);
  restoreIngredientsToReceipts(
    recipe,
    production.quantity,
    ingredients,
    receipts,
    updateIngredient,
    updateReceiptItem,
    production.consumptionDetails // Pass consumption details for precise restoration
  );
  
  // If this is a semi-finished product, we want to decompose it to ingredients
  // If it's a finished product, we only want to restore the semi-finished products, not decompose them
  const shouldDecompose = isSemiFinished;
  
  console.log(`Should decompose semi-finals? ${shouldDecompose ? 'Yes' : 'No'} for ${recipe.name}`);
  
  // Restore semi-finished products using FIFO details if available
  // Only if the recipe has any semi-final products
  if (recipe.items.some(item => item.type === 'recipe')) {
    try {
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
        shouldDecompose // Set based on recipe category to correctly handle decomposition
      );
    } catch (error) {
      console.error('Error restoring semi-finals:', error);
    }
  }
  
  if (shouldDecompose) {
    console.log(`Semi-finished production ${idStr} has been deleted and ingredients have been returned to stock`);
  } else {
    console.log(`Finished production ${idStr} has been deleted and semi-finals have been restored to stock`);
  }
};
