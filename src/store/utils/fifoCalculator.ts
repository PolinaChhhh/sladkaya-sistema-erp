
import { Recipe, RecipeItem, Ingredient, Receipt, ReceiptItem } from '../types';

// Calculate the amount of each ingredient needed for a production
export const calculateIngredientsNeeded = (
  recipe: Recipe,
  quantity: number
): { ingredientId: string; amountNeeded: number }[] => {
  const productionRatio = quantity / recipe.output;
  
  return recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .map(item => ({
      ingredientId: item.ingredientId as string,
      amountNeeded: item.amount * productionRatio
    }));
};

// Check if there are sufficient ingredients and semi-finished products for a production
export const checkIngredientsAvailability = (
  recipe: Recipe | undefined,
  quantity: number,
  ingredients: Ingredient[],
  recipes?: Recipe[],
  productions?: any[]
): { canProduce: boolean; insufficientIngredients: string[] } => {
  if (!recipe) {
    return { canProduce: false, insufficientIngredients: ['Recipe not found'] };
  }
  
  const productionRatio = quantity / recipe.output;
  let canProduce = true;
  const insufficientIngredients: string[] = [];
  
  // Check regular ingredients
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * productionRatio;
        if (ingredient.quantity < amountNeeded) {
          canProduce = false;
          insufficientIngredients.push(ingredient.name);
        }
      }
    } else if (item.type === 'recipe' && item.recipeId && recipes && productions) {
      // Check semi-finished products
      const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Calculate available quantity of this semi-finished product
        const availableQuantity = productions
          .filter(p => p.recipeId === item.recipeId)
          .reduce((total, p) => total + p.quantity, 0);
        
        if (availableQuantity < amountNeeded) {
          canProduce = false;
          insufficientIngredients.push(semiFinalRecipe.name);
        }
      }
    }
  });
  
  return { canProduce, insufficientIngredients };
};

// Get receipt items for an ingredient sorted by date (FIFO)
export const getFifoReceiptItems = (
  ingredientId: string,
  receipts: Receipt[]
) => {
  return receipts
    .flatMap(receipt => receipt.items
      .filter(item => item.ingredientId === ingredientId && item.remainingQuantity > 0)
      .map(item => ({
        ...item,
        receiptId: receipt.id,
        receiptDate: receipt.date
      }))
    )
    .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
};

// Consume ingredients using FIFO and calculate cost
export const consumeIngredientsWithFifo = (
  recipe: Recipe,
  quantity: number,
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): number => {
  const productionRatio = quantity / recipe.output;
  let totalCost = 0;
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * productionRatio;
        let remainingToConsume = amountNeeded;
        let ingredientCost = 0;
        
        // Get all receipt items for this ingredient, sorted by date (oldest first)
        const allReceiptItems = getFifoReceiptItems(item.ingredientId, receipts);
        
        // Consume from oldest receipt items first (FIFO)
        for (const receiptItem of allReceiptItems) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
          
          // Calculate the cost for this portion using the receipt's unit price
          ingredientCost += consumeAmount * receiptItem.unitPrice;
          
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
      }
    }
  });
  
  return totalCost;
};

// Restore ingredients to receipt items, newest first (for deleting productions)
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
