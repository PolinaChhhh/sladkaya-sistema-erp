
import { Recipe, Ingredient, Receipt, ReceiptItem, ProductionBatch } from '@/store/types';
import { getFifoReceiptItems } from '@/store/utils/fifoCalculator';

export const useProductionUtils = (recipes: Recipe[], productions: ProductionBatch[] = []) => {
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  // Get available quantity of a semi-finished product
  const getAvailableSemiFinalQuantity = (recipeId: string): number => {
    // Get all productions for this semi-finished product
    const semiFinalProductions = productions.filter(p => p.recipeId === recipeId);
    
    // Sum up the total produced amount
    const totalProduced = semiFinalProductions.reduce((sum, p) => sum + p.quantity, 0);
    
    // Here we would need to subtract any consumed amount
    // For now, we'll return the total produced amount
    return totalProduced;
  };

  // Calculate the estimated cost of a production using FIFO
  // This is used for previewing cost before creating a production
  const calculateEstimatedCost = (
    recipeId: string, 
    quantity: number,
    ingredients: Ingredient[],
    receipts: Receipt[]
  ): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;

    const productionRatio = quantity / recipe.output;
    let totalCost = 0;
    
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const amountNeeded = item.amount * productionRatio;
        let remainingToConsume = amountNeeded;
        let ingredientCost = 0;
        
        // Get receipt items for FIFO calculation
        const allReceiptItems = getFifoReceiptItems(item.ingredientId, receipts);
        
        // Calculate cost based on FIFO without actually consuming
        for (const receiptItem of allReceiptItems) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
          ingredientCost += consumeAmount * receiptItem.unitPrice;
          remainingToConsume -= consumeAmount;
        }
        
        totalCost += ingredientCost;
      } else if (item.type === 'recipe' && item.recipeId) {
        // Handle semi-finished product cost
        const amountNeeded = item.amount * productionRatio;
        let semiFinalCost = 0;
        
        // Get previous productions of this semi-finished product
        const semiFinalProductions = productions.filter(p => p.recipeId === item.recipeId)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        if (semiFinalProductions.length > 0) {
          // Calculate average cost of semi-finished product
          const totalCost = semiFinalProductions.reduce((sum, p) => sum + p.cost, 0);
          const totalQuantity = semiFinalProductions.reduce((sum, p) => sum + p.quantity, 0);
          const averageUnitCost = totalCost / totalQuantity;
          
          semiFinalCost = amountNeeded * averageUnitCost;
        }
        
        totalCost += semiFinalCost;
      }
    });
    
    return totalCost;
  };

  // Check if there are sufficient semi-finished ingredients for production
  const checkSemiFinalAvailability = (
    recipeId: string,
    quantity: number
  ): { canProduce: boolean; insufficientItems: Array<{name: string, required: number, available: number, unit: string}> } => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return { canProduce: false, insufficientItems: [] };
    
    const productionRatio = quantity / recipe.output;
    const insufficientItems: Array<{name: string, required: number, available: number, unit: string}> = [];
    
    recipe.items.forEach(item => {
      if (item.type === 'recipe' && item.recipeId) {
        const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
        if (semiFinalRecipe) {
          const requiredAmount = item.amount * productionRatio;
          const availableAmount = getAvailableSemiFinalQuantity(item.recipeId);
          
          if (availableAmount < requiredAmount) {
            insufficientItems.push({
              name: semiFinalRecipe.name,
              required: requiredAmount,
              available: availableAmount,
              unit: semiFinalRecipe.outputUnit
            });
          }
        }
      }
    });
    
    return { 
      canProduce: insufficientItems.length === 0,
      insufficientItems 
    };
  };

  return {
    getRecipeName,
    getRecipeOutput,
    calculateEstimatedCost,
    checkSemiFinalAvailability,
    getAvailableSemiFinalQuantity
  };
};
