
import { Recipe, Ingredient, ProductionBatch } from '@/store/types';
import { ConsumedSemiFinalItem } from '@/store/utils/fifo/consumeSemiFinals';

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
  fifoDetails?: {
    productionId: string;
    date: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}

/**
 * Get a breakdown of semi-final products used in a recipe
 */
export const getSemiFinalBreakdown = (
  recipeId: string, 
  quantity: number,
  recipes: Recipe[],
  ingredients: Ingredient[],
  productions: ProductionBatch[] = [],
  production?: ProductionBatch
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
        let semiCost = 0;
        
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
        
        // If we have consumption details for this production and semi-final, use them
        let fifoDetails;
        if (production?.consumptionDetails && production.consumptionDetails[semiRecipeId]) {
          // Safely cast to ConsumedSemiFinalItem[] using as unknown first
          const consumedItems = production.consumptionDetails[semiRecipeId] as unknown as ConsumedSemiFinalItem[];
          
          fifoDetails = consumedItems.map(consumed => {
            return {
              productionId: consumed.productionId,
              date: consumed.date,
              quantity: consumed.amount,
              unitCost: consumed.unitCost,
              totalCost: consumed.amount * consumed.unitCost
            };
          });
          
          // Calculate the actual cost from the consumed items
          semiCost = fifoDetails.reduce((sum, detail) => sum + detail.totalCost, 0);
        } else {
          // Fallback to calculating cost directly
          semiCost = calculateCost(semiRecipe, semiAmount, ingredients);
        }
        
        breakdown.push({
          recipeId: semiRecipeId,
          name: semiRecipe.name,
          quantity: semiAmount,
          unit: semiRecipe.outputUnit,
          cost: semiCost,
          ingredients: semiIngredients,
          fifoDetails
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
