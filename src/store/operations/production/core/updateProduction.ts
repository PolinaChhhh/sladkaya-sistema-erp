
import { ProductionBatch, Recipe } from '../../../types';
import { consumeIngredientsWithFifo, restoreIngredientsToReceipts } from '../../../utils/fifoCalculator';
import { consumeSemiFinalProducts, restoreSemiFinalProducts } from '../../../utils/semiFinalProductUtils';

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
      const { totalCost: ingredientCost, consumptionDetails } = consumeIngredientsWithFifo(
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
      const totalCost = ingredientCost + semiFinalCost;
      data.cost = totalCost;
      data.consumptionDetails = consumptionDetails;
    }
  }
  
  return data;
};
