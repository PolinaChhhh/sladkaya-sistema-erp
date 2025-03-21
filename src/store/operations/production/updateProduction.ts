
import { ProductionBatch, Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';
import { 
  checkIngredientsAvailability, 
  consumeIngredientsWithFifo, 
  restoreIngredientsToReceipts 
} from '../../utils/fifoCalculator';

export const updateProductionBatch = (
  id: string,
  data: Partial<ProductionBatch>,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): ProductionBatch[] => {
  const originalProduction = productions.find(production => production.id === id);
  
  if (!originalProduction) {
    return productions;
  }

  // If the quantity has changed, we need to adjust the ingredient quantities
  if (data.quantity !== undefined && data.quantity !== originalProduction.quantity) {
    const recipe = recipes.find(r => r.id === originalProduction.recipeId);
    
    if (recipe) {
      // First, restore the ingredients used in the original production
      restoreIngredientsToReceipts(
        recipe,
        originalProduction.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );

      // Calculate the new ratio and check if we have enough ingredients
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe,
        data.quantity as number,
        ingredients
      );
      
      if (!canProduce) {
        console.error(`Cannot update production: Insufficient ingredients: ${insufficientIngredients.join(', ')}`);
        
        // Revert the restoration since we can't update
        // Re-consume the original amounts
        consumeIngredientsWithFifo(
          recipe,
          originalProduction.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        return productions;
      }
      
      // Calculate new cost using FIFO
      const totalCost = consumeIngredientsWithFifo(
        recipe,
        data.quantity as number,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // Update the cost with our calculated FIFO cost
      data.cost = totalCost;
    }
  }

  // Update the production with new data
  return productions.map((production) => 
    production.id === id ? { ...production, ...data } : production
  );
};
