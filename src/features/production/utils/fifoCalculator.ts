
import { Recipe, Ingredient, Receipt } from '@/store/types';

/**
 * Calculates the cost of production using FIFO method
 */
export const calculateCostWithFIFO = (
  recipeId: string,
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[]
): number => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return 0;
  
  const recipeItems = recipe.items;
  let totalCost = 0;
  
  // Calculate production ratio
  const productionRatio = quantity / recipe.output;
  
  recipeItems.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (!ingredient) return;
      
      const amountNeeded = item.amount * productionRatio;
      
      const allReceiptItems = receipts
        .flatMap(receipt => receipt.items
          .filter(ri => ri.ingredientId === item.ingredientId && ri.remainingQuantity > 0)
          .map(ri => ({
            ...ri,
            receiptDate: receipt.date
          }))
        )
        .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
      
      let costForIngredient = 0;
      let remainingToConsume = amountNeeded;
      
      // Simulate FIFO consumption for cost estimation
      for (const receiptItem of allReceiptItems) {
        if (remainingToConsume <= 0) break;
        
        const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
        costForIngredient += consumeAmount * receiptItem.unitPrice;
        remainingToConsume -= consumeAmount;
      }
      
      // If we couldn't find enough in receipts, use the current ingredient cost for the rest
      if (remainingToConsume > 0) {
        costForIngredient += remainingToConsume * ingredient.cost;
      }
      
      totalCost += costForIngredient;
    }
  });
  
  return totalCost;
};
