
import { Recipe, Ingredient, Receipt, ReceiptItem, ProductionBatch } from '@/store/types';

/**
 * Gets all receipt items for an ingredient sorted by date (FIFO order)
 */
export const getFifoReceiptItems = (
  ingredientId: string,
  receipts: Receipt[]
): { 
  receiptId: string; 
  itemId: string; 
  receiptDate: string; 
  quantity: number; 
  remainingQuantity: number; 
  unitPrice: number;
  receiptReference?: string;
}[] => {
  const items = receipts
    .flatMap(receipt => receipt.items
      .filter(item => item.ingredientId === ingredientId && item.remainingQuantity > 0)
      .map(item => ({
        receiptId: receipt.id,
        itemId: item.id,
        receiptDate: receipt.date,
        quantity: item.quantity,
        remainingQuantity: item.remainingQuantity,
        unitPrice: item.unitPrice,
        receiptReference: receipt.referenceNumber
      }))
    )
    // Sort by date - oldest first (FIFO)
    .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
  
  return items;
};

/**
 * Simulates FIFO consumption for cost calculation without actually updating the database
 */
export const simulateFifoConsumption = (
  ingredientId: string,
  amountNeeded: number,
  receipts: Receipt[]
): {
  totalCost: number;
  breakdown: {
    receiptId: string;
    itemId: string;
    receiptDate: string;
    amountUsed: number;
    unitPrice: number;
    totalPrice: number;
    receiptReference?: string;
  }[];
  insufficientAmount: boolean;
} => {
  const receiptItems = getFifoReceiptItems(ingredientId, receipts);
  let remainingToConsume = amountNeeded;
  let totalCost = 0;
  
  const breakdown: {
    receiptId: string;
    itemId: string;
    receiptDate: string;
    amountUsed: number;
    unitPrice: number;
    totalPrice: number;
    receiptReference?: string;
  }[] = [];
  
  // Simulate consumption using FIFO
  for (const item of receiptItems) {
    if (remainingToConsume <= 0) break;
    
    const amountToUse = Math.min(remainingToConsume, item.remainingQuantity);
    const costForThisPart = amountToUse * item.unitPrice;
    
    totalCost += costForThisPart;
    remainingToConsume -= amountToUse;
    
    breakdown.push({
      receiptId: item.receiptId,
      itemId: item.itemId,
      receiptDate: item.receiptDate,
      amountUsed: amountToUse,
      unitPrice: item.unitPrice,
      totalPrice: costForThisPart,
      receiptReference: item.receiptReference
    });
  }
  
  return {
    totalCost,
    breakdown,
    insufficientAmount: remainingToConsume > 0
  };
};

/**
 * Actually perform FIFO consumption by updating receipt items
 */
export const performFifoConsumption = (
  ingredientId: string,
  amountNeeded: number,
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void,
  ingredients: Ingredient[]
): {
  success: boolean;
  totalCost: number;
  breakdown: {
    receiptId: string;
    itemId: string;
    receiptDate: string;
    amountUsed: number;
    unitPrice: number;
    totalPrice: number;
    receiptReference?: string;
  }[];
} => {
  // First simulate to check if we have enough
  const simulation = simulateFifoConsumption(ingredientId, amountNeeded, receipts);
  
  if (simulation.insufficientAmount) {
    return {
      success: false,
      totalCost: simulation.totalCost,
      breakdown: simulation.breakdown
    };
  }
  
  // If we have enough, actually perform the consumption
  for (const consumedItem of simulation.breakdown) {
    // Update receipt item remaining quantity
    const receiptItem = receipts
      .find(r => r.id === consumedItem.receiptId)
      ?.items.find(i => i.id === consumedItem.itemId);
    
    if (receiptItem) {
      updateReceiptItem(consumedItem.receiptId, consumedItem.itemId, {
        remainingQuantity: receiptItem.remainingQuantity - consumedItem.amountUsed
      });
    }
  }
  
  // Update the ingredient quantity
  const ingredient = ingredients.find(i => i.id === ingredientId);
  if (ingredient) {
    updateIngredient(ingredientId, {
      quantity: Math.max(0, ingredient.quantity - amountNeeded)
    });
  }
  
  return {
    success: true,
    totalCost: simulation.totalCost,
    breakdown: simulation.breakdown
  };
};

/**
 * Calculate production costs using FIFO method
 */
export const calculateProductionCostWithFifo = (
  recipe: Recipe,
  quantity: number,
  ingredients: Ingredient[],
  receipts: Receipt[]
): {
  totalCost: number;
  breakdown: {
    ingredientId: string;
    amount: number;
    cost: number;
    details: {
      receiptId: string;
      receiptDate: string;
      amountUsed: number;
      unitPrice: number;
      totalPrice: number;
      receiptReference?: string;
    }[];
  }[];
  canProduce: boolean;
  insufficientIngredients: {
    ingredientId: string;
    required: number;
    available: number;
  }[];
} => {
  const productionRatio = quantity / recipe.output;
  const ingredientBreakdown: {
    ingredientId: string;
    amount: number;
    cost: number;
    details: {
      receiptId: string;
      receiptDate: string;
      amountUsed: number;
      unitPrice: number;
      totalPrice: number;
      receiptReference?: string;
    }[];
  }[] = [];
  
  let totalCost = 0;
  let canProduce = true;
  const insufficientIngredients: {
    ingredientId: string;
    required: number;
    available: number;
  }[] = [];
  
  // Process each ingredient in the recipe
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const amountNeeded = item.amount * productionRatio;
      
      // Simulate FIFO consumption
      const simulation = simulateFifoConsumption(ingredientId, amountNeeded, receipts);
      
      // Add to breakdown
      ingredientBreakdown.push({
        ingredientId,
        amount: amountNeeded,
        cost: simulation.totalCost,
        details: simulation.breakdown.map(b => ({
          receiptId: b.receiptId,
          receiptDate: b.receiptDate,
          amountUsed: b.amountUsed,
          unitPrice: b.unitPrice,
          totalPrice: b.totalPrice,
          receiptReference: b.receiptReference
        }))
      });
      
      // Add to total cost
      totalCost += simulation.totalCost;
      
      // Check if we have enough
      if (simulation.insufficientAmount) {
        canProduce = false;
        
        // Calculate how much is available
        const availableAmount = simulation.breakdown.reduce(
          (sum, item) => sum + item.amountUsed, 
          0
        );
        
        insufficientIngredients.push({
          ingredientId,
          required: amountNeeded,
          available: availableAmount
        });
      }
    });
  
  return {
    totalCost,
    breakdown: ingredientBreakdown,
    canProduce,
    insufficientIngredients
  };
};
