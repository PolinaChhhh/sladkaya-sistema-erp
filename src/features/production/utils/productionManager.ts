
import { Recipe, ProductionBatch, Ingredient, Receipt, ReceiptItem } from '@/store/types';
import { performFifoConsumption, simulateFifoConsumption } from './fifoCalculator';

/**
 * Create a production while properly accounting for ingredients with FIFO method
 */
export const createProduction = (
  recipeId: string,
  quantity: number,
  date: string,
  autoProduceSemiFinals: boolean,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void,
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void
): {
  success: boolean;
  productionId?: string;
  cost?: number;
  errorMessage?: string;
  insufficientItems?: Array<{name: string, required: number, available: number, unit: string}>;
} => {
  const recipe = recipes.find(r => r.id === recipeId);
  
  if (!recipe) {
    return {
      success: false,
      errorMessage: 'Recipe not found'
    };
  }
  
  // Update the last produced date
  updateRecipe(recipe.id, {
    lastProduced: new Date().toISOString()
  });
  
  // Calculate how much of each ingredient is needed
  const productionRatio = quantity / recipe.output;
  let totalCost = 0;
  
  // Check for semi-finished products first
  const semiFinalItems = recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId);
  
  if (semiFinalItems.length > 0) {
    // This recipe uses semi-finished products
    
    // For finished products that need semi-finished ingredients
    if (recipe.category === 'finished') {
      // Handle auto-production of semi-finals
      for (const item of semiFinalItems) {
        const semiFinalId = item.recipeId as string;
        const amountNeeded = item.amount * productionRatio;
        
        if (autoProduceSemiFinals) {
          // Auto-produce the semi-finished product
          const semiFinalResult = createProduction(
            semiFinalId,
            amountNeeded,
            date,
            false, // Don't recursively auto-produce
            recipes,
            ingredients,
            receipts,
            updateIngredient,
            updateReceiptItem,
            addProduction,
            updateRecipe
          );
          
          if (!semiFinalResult.success) {
            return semiFinalResult; // Return the error
          }
          
          // Add the cost of the semi-finished product
          if (semiFinalResult.cost) {
            totalCost += semiFinalResult.cost;
          }
        } else {
          // If not auto-producing, we need to calculate the cost from existing semi-finished products
          // For now, we'll estimate based on recipe costs
          const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
          if (semiFinalRecipe) {
            // Simulate the cost by calculating what ingredients would be used
            let semiFinalCost = 0;
            
            // Calculate raw ingredient costs for this semi-final
            semiFinalRecipe.items
              .filter(sfItem => sfItem.type === 'ingredient' && sfItem.ingredientId)
              .forEach(sfItem => {
                const ingredientId = sfItem.ingredientId as string;
                const sfAmount = sfItem.amount * (amountNeeded / semiFinalRecipe.output);
                
                // Simulate FIFO consumption to get accurate costs
                const simulatedCost = simulateFifoConsumption(
                  ingredientId,
                  sfAmount,
                  receipts
                );
                
                semiFinalCost += simulatedCost.totalCost;
              });
            
            totalCost += semiFinalCost;
            console.log(`Estimated semi-final ${semiFinalRecipe.name} cost: ${semiFinalCost}`);
          }
        }
      }
    }
  }
  
  // Now handle direct ingredients
  const ingredientItems = recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId);
  
  const insufficientItems: Array<{
    name: string, 
    required: number, 
    available: number, 
    unit: string
  }> = [];
  
  for (const item of ingredientItems) {
    const ingredientId = item.ingredientId as string;
    const amountNeeded = item.amount * productionRatio;
    
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) continue;
    
    // First simulate to check if we have enough
    const simulation = simulateFifoConsumption(
      ingredientId,
      amountNeeded,
      receipts
    );
    
    if (simulation.insufficientAmount) {
      // Not enough of this ingredient
      const totalAvailable = simulation.breakdown.reduce(
        (sum, item) => sum + item.amountUsed, 
        0
      );
      
      insufficientItems.push({
        name: ingredient.name,
        required: amountNeeded,
        available: totalAvailable,
        unit: ingredient.unit
      });
      
      console.log(`Insufficient ingredient: ${ingredient.name}, need ${amountNeeded}, have ${totalAvailable}`);
      continue;
    }
    
    // Add simulated cost to total
    totalCost += simulation.totalCost;
    
    // Log the breakdown of receipt costs for this ingredient
    console.log(`Ingredient ${ingredient.name} cost breakdown:`);
    simulation.breakdown.forEach(b => {
      console.log(`  From receipt ${b.receiptReference || b.receiptId}: ${b.amountUsed} @ ${b.unitPrice} = ${b.totalPrice}`);
    });
  }
  
  // If we have insufficient items and this is a required check
  if (insufficientItems.length > 0) {
    return {
      success: false,
      errorMessage: 'Insufficient ingredients',
      insufficientItems
    };
  }
  
  // After calculating the cost, now perform the actual consumption
  for (const item of ingredientItems) {
    const ingredientId = item.ingredientId as string;
    const amountNeeded = item.amount * productionRatio;
    
    // Consume ingredients using FIFO
    performFifoConsumption(
      ingredientId,
      amountNeeded,
      receipts,
      updateIngredient,
      updateReceiptItem,
      ingredients
    );
  }
  
  // Create the production with calculated cost
  const productionData: Omit<ProductionBatch, 'id'> = {
    recipeId,
    quantity,
    date,
    cost: totalCost,
    autoProduceSemiFinals
  };
  
  // This is a stub - in a real system we would return the created production ID
  addProduction(productionData);
  
  return {
    success: true,
    cost: totalCost
  };
};

/**
 * Delete a production and restore ingredients
 */
export const deleteProduction = (
  productionId: string,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void,
  deleteProductionFn: (id: string) => void
): boolean => {
  const production = productions.find(p => p.id === productionId);
  if (!production) return false;
  
  const recipe = recipes.find(r => r.id === production.recipeId);
  if (!recipe) return false;
  
  // Calculate how much of each ingredient to restore
  const productionRatio = production.quantity / recipe.output;
  
  // Process ingredient items
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const amountToRestore = item.amount * productionRatio;
      
      // Find the ingredient
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;
      
      // Restore the ingredient quantity
      updateIngredient(ingredientId, {
        quantity: ingredient.quantity + amountToRestore
      });
      
      // This is where we would restore to receipt items in a real system
      // For now, we'll just restore to the newest receipt item for this ingredient
      const receiptItems = receipts
        .flatMap(receipt => receipt.items
          .filter(item => item.ingredientId === ingredientId)
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
        
        // Calculate how much we can restore to this receipt item
        const originalQuantity = receiptItem.quantity;
        const currentRemaining = receiptItem.remainingQuantity;
        const consumed = originalQuantity - currentRemaining;
        
        const restoreAmount = Math.min(remainingToRestore, consumed);
        
        if (restoreAmount > 0) {
          // Restore to this receipt item
          updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
            remainingQuantity: currentRemaining + restoreAmount
          });
          
          remainingToRestore -= restoreAmount;
        }
      }
    });
  
  // Delete the production
  deleteProductionFn(productionId);
  
  return true;
};
