
import { Recipe, Receipt, Ingredient, ProductionBatch } from '@/store/types';
import { ConsumedReceiptItem } from '@/store/utils/fifo/consumeIngredients';

export interface IngredientUsageDetail {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: {
    receiptId: string;
    referenceNumber?: string;
    date: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

/**
 * Get detailed information about how ingredients are used from FIFO receipts
 * based on actual consumption details stored with the production
 */
export const getIngredientUsageDetails = (
  recipeId: string, 
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[] = [], // Make receipts optional with default empty array
  production?: ProductionBatch
): IngredientUsageDetail[] => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return [];
  
  const ratio = quantity / recipe.output;
  const usageDetails: IngredientUsageDetail[] = [];
  
  // Get all ingredients used in this recipe
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const ingredient = ingredients.find(i => i.id === ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * ratio;
        
        // If we have consumption details for this production, use them
        if (production?.consumptionDetails && production.consumptionDetails[ingredientId]) {
          const consumedItems = production.consumptionDetails[ingredientId];
          const fifoDetails = consumedItems.map(consumed => {
            // Find the receipt that this item belongs to
            const receipt = receipts.find(r => r.id === consumed.receiptId);
            
            return {
              receiptId: consumed.receiptId,
              referenceNumber: consumed.referenceNumber || receipt?.referenceNumber,
              date: consumed.date,
              quantity: consumed.amount,
              unitPrice: consumed.unitPrice,
              totalPrice: consumed.amount * consumed.unitPrice
            };
          });
          
          // Calculate the actual cost from the consumed items
          const totalCost = fifoDetails.reduce((sum, detail) => sum + detail.totalPrice, 0);
          
          usageDetails.push({
            ingredientId,
            name: ingredient.name,
            totalAmount: amountNeeded,
            unit: ingredient.unit,
            totalCost,
            fifoDetails
          });
        } else {
          // When consumption details aren't available, we don't show any FIFO details
          // as they are not actually used in this production
          usageDetails.push({
            ingredientId,
            name: ingredient.name,
            totalAmount: amountNeeded,
            unit: ingredient.unit,
            totalCost: amountNeeded * ingredient.cost,
            fifoDetails: [] // Empty array since we don't know which specific receipts were consumed
          });
        }
      }
    });
  
  return usageDetails;
};
