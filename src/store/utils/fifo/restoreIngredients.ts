
import { Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';

/**
 * Restore ingredients to receipt items, newest first (for deleting productions)
 */
export const restoreIngredientsToReceipts = (
  recipe: Recipe,
  quantity: number,
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
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
            updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
              remainingQuantity: currentRemaining + restoreAmount
            });
            
            remainingToRestore -= restoreAmount;
          }
        }
      }
    }
  });
};
