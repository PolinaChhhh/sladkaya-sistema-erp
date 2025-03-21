
import { Recipe, Receipt, Ingredient, ProductionBatch } from '@/store/types';
import { ConsumedReceiptItem } from '@/store/utils/fifo/consumeIngredients';

export interface IngredientUsageDetail {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: {
    receiptId: string;
    referenceNumber?: string;
    date: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface SemiFinalBreakdown {
  recipeId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  ingredients: {
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
    cost: number;
  }[];
}

/**
 * Get detailed information about how ingredients are used from FIFO receipts
 * based on actual consumption details stored with the production
 */
export const getIngredientUsageDetails = (
  recipeId: string, 
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  production?: ProductionBatch
): IngredientUsageDetail[] => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return [];
  
  const ratio = quantity / recipe.output;
  const usageDetails: IngredientUsageDetail[] = [];
  
  // Get all ingredients used in this recipe
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const ingredient = ingredients.find(i => i.id === ingredientId);
      
      if (ingredient) {
        const amountNeeded = item.amount * ratio;
        
        // If we have consumption details for this production, use them
        if (production?.consumptionDetails && production.consumptionDetails[ingredientId]) {
          const consumedItems = production.consumptionDetails[ingredientId];
          const fifoDetails = consumedItems.map(consumed => {
            // Find the receipt that this item belongs to
            const receipt = receipts.find(r => r.id === consumed.receiptId);
            
            return {
              receiptId: consumed.receiptId,
              referenceNumber: consumed.referenceNumber || receipt?.referenceNumber,
              date: consumed.date,
              quantity: consumed.amount,
              unitPrice: consumed.unitPrice,
              totalPrice: consumed.amount * consumed.unitPrice
            };
          });
          
          // Calculate the actual cost from the consumed items
          const totalCost = fifoDetails.reduce((sum, detail) => sum + detail.totalPrice, 0);
          
          usageDetails.push({
            ingredientId,
            name: ingredient.name,
            totalAmount: amountNeeded,
            unit: ingredient.unit,
            totalCost,
            fifoDetails
          });
        } else {
          // Fallback to the old method if consumption details aren't available
          const fifoDetails = receipts
            .filter(receipt => receipt.items.some(i => i.ingredientId === ingredientId))
            .flatMap(receipt => {
              return receipt.items
                .filter(i => i.ingredientId === ingredientId)
                .map(i => ({
                  receiptId: receipt.id,
                  referenceNumber: receipt.referenceNumber,
                  date: receipt.date,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                  totalPrice: i.quantity * i.unitPrice
                }));
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          usageDetails.push({
            ingredientId,
            name: ingredient.name,
            totalAmount: amountNeeded,
            unit: ingredient.unit,
            totalCost: amountNeeded * ingredient.cost,
            fifoDetails
          });
        }
      }
    });
  
  return usageDetails;
};

/**
 * Get a breakdown of semi-final products used in a recipe
 */
export const getSemiFinalBreakdown = (
  recipeId: string, 
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[]
): SemiFinalBreakdown[] => {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return [];
  
  const ratio = quantity / recipe.output;
  const breakdown: SemiFinalBreakdown[] = [];
  
  // Find all semi-final recipes used
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiRecipeId = item.recipeId as string;
      const semiRecipe = recipes.find(r => r.id === semiRecipeId);
      
      if (semiRecipe) {
        const semiAmount = item.amount * ratio;
        const semiCost = calculateCost(semiRecipe, semiAmount, ingredients);
        
        // Get ingredients for this semi-final
        const semiIngredients = semiRecipe.items
          .filter(si => si.type === 'ingredient' && si.ingredientId)
          .map(si => {
            const semiIngredientId = si.ingredientId as string;
            const semiIngredient = ingredients.find(i => i.id === semiIngredientId);
            
            if (semiIngredient) {
              const semiRatio = semiAmount / semiRecipe.output;
              const amount = si.amount * semiRatio;
              return {
                ingredientId: semiIngredientId,
                name: semiIngredient.name,
                amount,
                unit: semiIngredient.unit,
                cost: amount * semiIngredient.cost
              };
            }
            return null;
          })
          .filter(si => si !== null) as {
            ingredientId: string;
            name: string;
            amount: number;
            unit: string;
            cost: number;
          }[];
        
        breakdown.push({
          recipeId: semiRecipeId,
          name: semiRecipe.name,
          quantity: semiAmount,
          unit: semiRecipe.outputUnit,
          cost: semiCost,
          ingredients: semiIngredients
        });
      }
    });
  
  return breakdown;
};

const calculateCost = (recipe: Recipe, quantity: number, ingredients: Ingredient[]): number => {
  let totalCost = 0;
  const ratio = quantity / recipe.output;
  
  recipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        totalCost += ingredient.cost * item.amount * ratio;
      }
    }
  });
  
  return totalCost;
};
