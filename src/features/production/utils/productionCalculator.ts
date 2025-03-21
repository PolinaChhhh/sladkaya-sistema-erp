
import { Recipe, Ingredient, Receipt, ProductionBatch } from '@/store/types';
import { getFifoReceiptItems } from '@/store/utils/fifoCalculator';

/**
 * Calculates the cost of producing a finished product based on semi-finished ingredients
 */
export const calculateFinishedProductCost = (
  recipeId: string,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[]
): number => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe || recipe.category !== 'finished') return 0;
  
  let totalCost = 0;
  const productionRatio = quantity / recipe.output;
  
  // Calculate cost from semi-finished ingredients
  recipe.items.forEach(item => {
    if (item.type === 'recipe' && item.recipeId) {
      const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
      if (!semiFinalRecipe) return;
      
      const amountNeeded = item.amount * productionRatio;
      
      // Get all production batches for this semi-finished product, sorted by date (oldest first)
      const semiFinalProductions = productions
        .filter(p => p.recipeId === item.recipeId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let remainingToConsume = amountNeeded;
      let costForSemiFinal = 0;
      
      // Calculate cost using FIFO method
      for (const production of semiFinalProductions) {
        if (remainingToConsume <= 0) break;
        
        const consumeAmount = Math.min(remainingToConsume, production.quantity);
        const unitCost = production.cost / production.quantity;
        costForSemiFinal += consumeAmount * unitCost;
        
        remainingToConsume -= consumeAmount;
      }
      
      // If we couldn't find enough produced semi-finals, estimate using average cost
      if (remainingToConsume > 0 && semiFinalProductions.length > 0) {
        const avgCost = semiFinalProductions.reduce((sum, p) => sum + (p.cost / p.quantity), 0) / semiFinalProductions.length;
        costForSemiFinal += remainingToConsume * avgCost;
      }
      
      totalCost += costForSemiFinal;
    }
  });
  
  return totalCost;
};

/**
 * Combines cost calculations for both raw ingredients and semi-finished products
 */
export const calculateTotalProductionCost = (
  recipeId: string,
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  productions: ProductionBatch[]
): number => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return 0;
  
  const rawIngredientCost = calculateRawIngredientsCost(recipeId, quantity, recipes, ingredients, receipts);
  
  // For finished products, add the cost of semi-finished products
  let semiFinishedCost = 0;
  if (recipe.category === 'finished') {
    semiFinishedCost = calculateFinishedProductCost(recipeId, quantity, recipes, productions);
  }
  
  // Return the combined cost
  return rawIngredientCost + semiFinishedCost;
};

/**
 * Calculates the cost of raw ingredients using FIFO method
 */
export const calculateRawIngredientsCost = (
  recipeId: string,
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[]
): number => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return 0;
  
  const recipeItems = recipe.items.filter(item => item.type === 'ingredient');
  let totalCost = 0;
  
  // Calculate production ratio
  const productionRatio = quantity / recipe.output;
  
  recipeItems.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (!ingredient) return;
      
      const amountNeeded = item.amount * productionRatio;
      
      // Get receipt items for FIFO calculation (oldest first)
      const allReceiptItems = getFifoReceiptItems(item.ingredientId, receipts);
      
      let costForIngredient = 0;
      let remainingToConsume = amountNeeded;
      
      // Simulate FIFO consumption for cost calculation
      for (const receiptItem of allReceiptItems) {
        if (remainingToConsume <= 0) break;
        
        const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
        costForIngredient += consumeAmount * receiptItem.unitPrice;
        remainingToConsume -= consumeAmount;
      }
      
      // If we couldn't find enough in receipts, use the current ingredient cost for the rest
      if (remainingToConsume > 0) {
        costForIngredient += remainingToConsume * ingredient.cost;
      }
      
      // Include cost for this ingredient
      totalCost += costForIngredient;
      
      console.log(`Ingredient ${ingredient.name}: amount=${amountNeeded}, cost=${costForIngredient.toFixed(2)}, unit=${ingredient.unit}`);
    }
  });
  
  return totalCost;
};
