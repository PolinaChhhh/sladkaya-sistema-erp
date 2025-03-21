
import { Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';
import { ConsumedReceiptItem } from './consumeIngredients';

/**
 * Restore ingredients to receipt items, newest first (for deleting productions)
 */
export const restoreIngredientsToReceipts = (
  recipe: Recipe,
  quantity: number,
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void,
  consumptionDetails?: Record<string, ConsumedReceiptItem[]>
): void => {
  const ratio = quantity / recipe.output;
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountToRestore = item.amount * ratio;
        
        // Restore the ingredient quantity
        updateIngredient(ingredient.id, {
          quantity: ingredient.quantity + amountToRestore
        });
        
        // If we have consumption details, use them for precise restoration
        if (consumptionDetails && consumptionDetails[item.ingredientId]) {
          const consumedItems = consumptionDetails[item.ingredientId];
          
          // Restore to each receipt item based on recorded consumption
          consumedItems.forEach(consumed => {
            console.log(`Precisely restoring ${consumed.amount} of ${ingredient.name} to receipt ${consumed.receiptId}, item ${consumed.itemId}`);
            
            updateReceiptItem(consumed.receiptId, consumed.itemId, {
              remainingQuantity: receipts
                .flatMap(r => r.items)
                .find(ri => ri.id === consumed.itemId && ri.receiptId === consumed.receiptId)?.remainingQuantity + consumed.amount || 0
            });
          });
        } else {
          // Fallback to the original method when consumption details aren't available
          console.log(`No consumption details available for ${ingredient.name}, using ratio-based restoration`);
          
          // For deleted productions, we'll restore to the newest receipt items
          const receiptItems = receipts
            .flatMap(receipt => receipt.items
              .filter(item => item.ingredientId === ingredient.id)
              .map(item => ({
                ...item,
                receiptId: receipt.id,
                receiptDate: receipt.date
              }))
            )
            .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime());
          
          let remainingToRestore = amountToRestore;
          for (const receiptItem of receiptItems) {
            if (remainingToRestore <= 0) break;
            
            // We can't restore more than was originally in the receipt
            const originalTotal = receiptItem.quantity;
            const currentRemaining = receiptItem.remainingQuantity;
            const consumed = originalTotal - currentRemaining;
            
            const restoreAmount = Math.min(remainingToRestore, consumed);
            
            if (restoreAmount > 0) {
              console.log(`Ratio-based: Restoring ${restoreAmount} of ${ingredient.name} to receipt ${receiptItem.receiptId}`);
              
              updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
                remainingQuantity: currentRemaining + restoreAmount
              });
              
              remainingToRestore -= restoreAmount;
            }
          }
        }
      }
    }
  });
};
