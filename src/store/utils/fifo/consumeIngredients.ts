
import { Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';
import { getFifoReceiptItems } from './receiptHelpers';

// Track which receipt items were consumed for a specific production
export interface ConsumedReceiptItem {
  receiptId: string;
  itemId: string;
  amount: number;
  unitPrice: number;
  date: string;
  referenceNumber?: string;
}

/**
 * Consume ingredients using FIFO and calculate cost
 */
export const consumeIngredientsWithFifo = (
  recipe: Recipe,
  quantity: number,
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): { totalCost: number; consumptionDetails: Record<string, ConsumedReceiptItem[]> } => {
  console.log(`Consuming ingredients for recipe ${recipe.name}, quantity: ${quantity}`);
  const productionRatio = quantity / recipe.output;
  let totalCost = 0;
  
  // Track which receipt items were consumed for each ingredient
  const consumptionDetails: Record<string, ConsumedReceiptItem[]> = {};
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * productionRatio;
        console.log(`Need to consume ${amountNeeded} of ${ingredient.name} (id: ${ingredient.id})`);
        let remainingToConsume = amountNeeded;
        let ingredientCost = 0;
        
        // Initialize the consumption tracking for this ingredient
        consumptionDetails[item.ingredientId] = [];
        
        // Get all receipt items for this ingredient, sorted by date (oldest first)
        const allReceiptItems = getFifoReceiptItems(item.ingredientId, receipts);
        console.log(`Found ${allReceiptItems.length} receipt items for ${ingredient.name}`);
        
        // Consume from oldest receipt items first (FIFO)
        for (const receiptItem of allReceiptItems) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
          
          if (consumeAmount <= 0) continue;
          
          // Calculate the cost for this portion using the receipt's unit price
          const portionCost = consumeAmount * receiptItem.unitPrice;
          ingredientCost += portionCost;
          
          console.log(`Consuming ${consumeAmount} of ${ingredient.name} from receipt ${receiptItem.receiptId}, item ${receiptItem.id}`);
          console.log(`Receipt item remaining quantity: ${receiptItem.remainingQuantity} - ${consumeAmount} = ${receiptItem.remainingQuantity - consumeAmount}`);
          
          // Track this consumption
          consumptionDetails[item.ingredientId].push({
            receiptId: receiptItem.receiptId,
            itemId: receiptItem.id,
            amount: consumeAmount,
            unitPrice: receiptItem.unitPrice,
            date: receiptItem.receiptDate,
            referenceNumber: receiptItem.referenceNumber
          });
          
          // Reduce the remaining amount from this receipt item
          updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
            remainingQuantity: receiptItem.remainingQuantity - consumeAmount
          });
          
          remainingToConsume -= consumeAmount;
        }
        
        // Add the cost of this ingredient to the total cost
        totalCost += ingredientCost;
        
        // Update the ingredient quantity
        updateIngredient(ingredient.id, {
          quantity: Math.max(0, ingredient.quantity - amountNeeded)
        });
        
        console.log(`Updated ${ingredient.name} quantity to ${Math.max(0, ingredient.quantity - amountNeeded)}`);
        console.log(`Recorded ${consumptionDetails[item.ingredientId].length} consumption entries for ${ingredient.name}`);
      }
    }
  });
  
  // Log the entire consumption details for debugging
  console.log(`Consumption details for ${recipe.name}:`, Object.keys(consumptionDetails).map(key => 
    `${key}: ${consumptionDetails[key].length} items`
  ).join(', '));
  
  return { totalCost, consumptionDetails };
};
