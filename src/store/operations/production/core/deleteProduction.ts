
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
  
  if (!recipe) {
    console.error('Recipe not found');
    return;
  }
  
  console.log(`Deleting production ${id} of recipe ${recipe.name} (category: ${recipe.category})`);
  
  // Check if this is a semi-finished or a finished product
  const isSemiFinished = recipe.category === 'semi-finished';
  
  // Restore ingredients to receipts - but only for semi-finished products
  // or if the recipe doesn't use any semi-finals
  if (isSemiFinished || !recipe.items.some(item => item.type === 'recipe')) {
    console.log(`Restoring ingredients for ${recipe.name} (semi-finished: ${isSemiFinished})`);
    restoreIngredientsToReceipts(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
  }
  
  // If this is a semi-finished product, we want to decompose it to ingredients
  // If it's a finished product, we only want to restore the semi-finished products, not decompose them
  const shouldDecompose = isSemiFinished;
  
  console.log(`Should decompose semi-finals? ${shouldDecompose ? 'Yes' : 'No'} for ${recipe.name}`);
  
  // Restore semi-finished products using FIFO details if available
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
  
  if (shouldDecompose) {
    console.log(`Semi-finished production ${id} has been deleted and ingredients have been returned to stock`);
  } else {
    console.log(`Finished production ${id} has been deleted and semi-finals have been restored to stock`);
  }
};
