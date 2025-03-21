
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
      const ingredientIdStr = String(item.ingredientId);
      const ingredient = ingredients.find(i => String(i.id) === ingredientIdStr);
      
      if (ingredient) {
        const amountToRestore = item.amount * ratio;
        console.log(`Need to restore ${amountToRestore} of ${ingredient.name} (id: ${ingredient.id})`);
        
        // Важно: сначала обновляем количество ингредиента
        const newQuantity = ingredient.quantity + amountToRestore;
        console.log(`Updating ingredient ${ingredient.name} quantity: ${ingredient.quantity} + ${amountToRestore} = ${newQuantity}`);
        
        // Явно преобразуем ID к строке и принудительно вызываем обновление
        updateIngredient(String(ingredient.id), {
          quantity: newQuantity
        });
        
        // Нормализуем ID ингредиента для соответствия ключам в consumptionDetails
        console.log(`Restoring ingredient ${ingredient.name} using key: ${ingredientIdStr}`);
        
        // Если у нас есть детали потребления, используем их для точного восстановления
        if (consumptionDetails && consumptionDetails[ingredientIdStr] && consumptionDetails[ingredientIdStr].length > 0) {
          const consumedItems = consumptionDetails[ingredientIdStr];
          console.log(`Found ${consumedItems.length} consumed receipt items for ${ingredient.name}`);
          
          // Восстанавливаем по каждому элементу чека на основе записанного потребления
          consumedItems.forEach(consumed => {
            // Преобразуем ID к строкам для обеспечения согласованного сравнения
            const receiptIdStr = String(consumed.receiptId);
            const itemIdStr = String(consumed.itemId);
            
            console.log(`Precisely restoring ${consumed.amount} of ${ingredient.name} to receipt ${receiptIdStr}, item ${itemIdStr}`);
            
            // Находим текущее оставшееся количество элемента чека
            const receipt = receipts.find(r => String(r.id) === receiptIdStr);
            
            if (!receipt) {
              console.error(`Receipt not found: receiptId=${receiptIdStr}`);
              return; // Пропускаем этот элемент, но продолжаем с другими
            }
            
            const receiptItem = receipt.items.find(ri => String(ri.id) === itemIdStr);
            
            if (receiptItem) {
              const newRemainingQuantity = receiptItem.remainingQuantity + consumed.amount;
              console.log(`Updating receipt item ${itemIdStr} remaining quantity: ${receiptItem.remainingQuantity} + ${consumed.amount} = ${newRemainingQuantity}`);
              
              // Убедимся, что передаем строковые ID в updateReceiptItem
              updateReceiptItem(receiptIdStr, itemIdStr, {
                remainingQuantity: newRemainingQuantity
              });
              console.log(`Called updateReceiptItem with receiptId=${receiptIdStr}, itemId=${itemIdStr}, new quantity=${newRemainingQuantity}`);
            } else {
              console.error(`Receipt item not found: receiptId=${receiptIdStr}, itemId=${itemIdStr}`);
            }
          });
        } else {
          // Запасной вариант для оригинального метода, когда детали потребления недоступны
          console.log(`No consumption details available for ${ingredient.name} (key: ${ingredientIdStr}), using ratio-based restoration`);
          
          // Для удаленных продуктов мы восстановим в самые новые элементы чека
          const receiptItems = receipts
            .flatMap(receipt => receipt.items
              .filter(item => String(item.ingredientId) === ingredientIdStr)
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
            
            // Мы не можем восстановить больше, чем было изначально в чеке
            const originalTotal = receiptItem.quantity;
            const currentRemaining = receiptItem.remainingQuantity;
            const consumed = originalTotal - currentRemaining;
            
            const restoreAmount = Math.min(remainingToRestore, consumed);
            
            if (restoreAmount > 0) {
              console.log(`Ratio-based: Restoring ${restoreAmount} of ${ingredient.name} to receipt ${receiptItem.receiptId}, item ${receiptItem.id}`);
              console.log(`Receipt item details: original=${originalTotal}, remaining=${currentRemaining}, consumed=${consumed}`);
              
              // Убедимся, что передаем строковые ID
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
