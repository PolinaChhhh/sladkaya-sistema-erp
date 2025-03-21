
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
  console.log(`Restoring ingredients for recipe ${recipe.name}, quantity: ${quantity}`);
  console.log(`Consumption details available: ${!!consumptionDetails}`);
  if (consumptionDetails) {
    console.log(`Consumption details keys: ${Object.keys(consumptionDetails).join(', ')}`);
  }
  
  const ratio = quantity / recipe.output;
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountToRestore = item.amount * ratio;
        console.log(`Need to restore ${amountToRestore} of ${ingredient.name} (id: ${ingredient.id})`);
        
        // Restore the ingredient quantity
        updateIngredient(ingredient.id, {
          quantity: ingredient.quantity + amountToRestore
        });
        console.log(`Updated ingredient quantity: ${ingredient.quantity} + ${amountToRestore} = ${ingredient.quantity + amountToRestore}`);
        
        // Normalize the ingredient ID to ensure it matches the keys in consumptionDetails
        const ingredientKey = String(item.ingredientId);
        console.log(`Restoring ingredient ${ingredient.name} using key: ${ingredientKey}`);
        
        // If we have consumption details, use them for precise restoration
        if (consumptionDetails && consumptionDetails[ingredientKey] && consumptionDetails[ingredientKey].length > 0) {
          const consumedItems = consumptionDetails[ingredientKey];
          console.log(`Found ${consumedItems.length} consumed receipt items for ${ingredient.name}`);
          
          // Restore to each receipt item based on recorded consumption
          consumedItems.forEach(consumed => {
            // Convert IDs to strings to ensure consistent comparison
            const receiptIdStr = String(consumed.receiptId);
            const itemIdStr = String(consumed.itemId);
            
            console.log(`Precisely restoring ${consumed.amount} of ${ingredient.name} to receipt ${receiptIdStr}, item ${itemIdStr}`);
            
            // Find the current remaining quantity of the receipt item
            const receipt = receipts.find(r => String(r.id) === receiptIdStr);
            
            if (!receipt) {
              console.error(`Receipt not found: receiptId=${receiptIdStr}`);
              return; // Skip this item but continue with others
            }
            
            const receiptItem = receipt.items.find(ri => String(ri.id) === itemIdStr);
            
            if (receiptItem) {
              const newRemainingQuantity = receiptItem.remainingQuantity + consumed.amount;
              console.log(`Updating receipt item ${itemIdStr} remaining quantity: ${receiptItem.remainingQuantity} + ${consumed.amount} = ${newRemainingQuantity}`);
              
              // Make sure we're passing string IDs to updateReceiptItem
              updateReceiptItem(receiptIdStr, itemIdStr, {
                remainingQuantity: newRemainingQuantity
              });
              console.log(`Called updateReceiptItem with receiptId=${receiptIdStr}, itemId=${itemIdStr}, new quantity=${newRemainingQuantity}`);
            } else {
              console.error(`Receipt item not found: receiptId=${receiptIdStr}, itemId=${itemIdStr}`);
            }
          });
        } else {
          // Fallback to the original method when consumption details aren't available
          console.log(`No consumption details available for ${ingredient.name} (key: ${ingredientKey}), using ratio-based restoration`);
          
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
          
          console.log(`Found ${receiptItems.length} receipt items for ratio-based restoration of ${ingredient.name}`);
          
          let remainingToRestore = amountToRestore;
          for (const receiptItem of receiptItems) {
            if (remainingToRestore <= 0) break;
            
            // We can't restore more than was originally in the receipt
            const originalTotal = receiptItem.quantity;
            const currentRemaining = receiptItem.remainingQuantity;
            const consumed = originalTotal - currentRemaining;
            
            const restoreAmount = Math.min(remainingToRestore, consumed);
            
            if (restoreAmount > 0) {
              console.log(`Ratio-based: Restoring ${restoreAmount} of ${ingredient.name} to receipt ${receiptItem.receiptId}, item ${receiptItem.id}`);
              console.log(`Receipt item details: original=${originalTotal}, remaining=${currentRemaining}, consumed=${consumed}`);
              
              // Make sure we're passing string IDs
              const receiptIdStr = String(receiptItem.receiptId);
              const itemIdStr = String(receiptItem.id);
              
              updateReceiptItem(receiptIdStr, itemIdStr, {
                remainingQuantity: currentRemaining + restoreAmount
              });
              console.log(`Called updateReceiptItem with receiptId=${receiptIdStr}, itemId=${itemIdStr}, new quantity=${currentRemaining + restoreAmount}`);
              
              remainingToRestore -= restoreAmount;
            }
          }
          
          if (remainingToRestore > 0) {
            console.warn(`Could not fully restore ${remainingToRestore} of ${ingredient.name} - no matching receipt items found`);
          }
        }
      } else {
        console.error(`Ingredient not found: ${item.ingredientId}`);
      }
    }
  });
};
