
import { Recipe, Ingredient, Receipt, ReceiptItem } from '@/store/types';
import { getFifoReceiptItems } from '@/store/utils/fifoCalculator';

export const useProductionUtils = (recipes: Recipe[]) => {
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  // Calculate the estimated cost of a production using FIFO
  // This is used for previewing cost before creating a production
  const calculateEstimatedCost = (
    recipeId: string, 
    quantity: number,
    ingredients: Ingredient[],
    receipts: Receipt[]
  ): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;

    const productionRatio = quantity / recipe.output;
    let totalCost = 0;
    
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const amountNeeded = item.amount * productionRatio;
        let remainingToConsume = amountNeeded;
        let ingredientCost = 0;
        
        // Get receipt items for FIFO calculation
        const allReceiptItems = getFifoReceiptItems(item.ingredientId, receipts);
        
        // Calculate cost based on FIFO without actually consuming
        for (const receiptItem of allReceiptItems) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
          ingredientCost += consumeAmount * receiptItem.unitPrice;
          remainingToConsume -= consumeAmount;
        }
        
        totalCost += ingredientCost;
      }
    });
    
    return totalCost;
  };

  return {
    getRecipeName,
    getRecipeOutput,
    calculateEstimatedCost
  };
};
