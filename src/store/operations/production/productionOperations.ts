
import { Recipe, ProductionBatch } from '../../types';
import { consumeIngredientsWithFifo, restoreIngredientsToReceipts } from '../../utils/fifoCalculator';
import { consumeSemiFinalProducts, restoreSemiFinalProducts } from '../../utils/semiFinalProductUtils';

/**
 * Handles adding a new production batch
 */
export const handleAddProduction = (
  production: Omit<ProductionBatch, 'id'>,
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  productions: ProductionBatch[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void
): ProductionBatch => {
  // Get recipe details
  const recipe = recipes.find(r => r.id === production.recipeId);
  
  if (!recipe) {
    console.error('Recipe not found');
    throw new Error('Recipe not found');
  }
  
  // Calculate cost using FIFO method for direct ingredients
  let cost = consumeIngredientsWithFifo(
    recipe,
    production.quantity,
    ingredients,
    receipts,
    updateIngredient,
    updateReceiptItem
  );
  
  // Handle semi-finished products in recipe
  const semiFinalCost = consumeSemiFinalProducts(
    recipe,
    production.quantity,
    recipes,
    productions,
    updateProduction
  );
  
  // Add semi-final cost to total cost
  cost += semiFinalCost;
  
  // Create new production with calculated cost
  const newProduction = {
    ...production,
    id: crypto.randomUUID(),
    cost: cost,
    date: new Date().toISOString()
  };
  
  // Update the lastProduced date for the recipe
  updateRecipe(recipe.id, { lastProduced: newProduction.date });
  
  return newProduction;
};

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
      // First restore the original ingredients
      restoreIngredientsToReceipts(
        recipe,
        originalProduction.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // Also restore semi-finished products
      restoreSemiFinalProducts(
        recipe,
        originalProduction.quantity,
        recipes,
        productions,
        updateProduction
      );
      
      // Then consume the new amount of ingredients
      let newCost = consumeIngredientsWithFifo(
        recipe,
        data.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // And consume new amount of semi-finished products
      const semiFinalCost = consumeSemiFinalProducts(
        recipe,
        data.quantity,
        recipes,
        productions,
        updateProduction
      );
      
      // Update the cost along with other changes
      newCost += semiFinalCost;
      data.cost = newCost;
    }
  }
  
  return data;
};

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
