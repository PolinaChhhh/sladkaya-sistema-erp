
import { ProductionBatch, Recipe } from '../../../types';
import { consumeIngredientsWithFifo } from '../../../utils/fifo/consumeIngredients';
import { checkIngredientsAvailability } from '../../../utils/fifo/checkAvailability';

/**
 * Handles adding a new production batch
 */
export const handleAddProduction = (
  production: Omit<ProductionBatch, 'id'>,
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  productions: ProductionBatch[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void
): ProductionBatch => {
  // Get recipe details
  const recipe = recipes.find(r => r.id === production.recipeId);
  
  if (!recipe) {
    console.error('Recipe not found');
    throw new Error('Recipe not found');
  }
  
  // Check if there are enough ingredients available
  const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
    recipe,
    production.quantity,
    ingredients,
    recipes,
    productions,
    false // Больше не нужно пропускать проверки полуфабрикатов
  );
  
  if (!canProduce) {
    throw new Error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
  }
  
  try {
    // Calculate cost using FIFO method for direct ingredients
    const { totalCost: ingredientCost, consumptionDetails } = consumeIngredientsWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    console.log(`Ingredient consumption details for ${recipe.name}:`, Object.keys(consumptionDetails).map(key => 
      `${key}: ${consumptionDetails[key].length} items`
    ).join(', '));
    
    // Create new production with calculated cost and consumption details
    const newProduction = {
      ...production,
      id: crypto.randomUUID(),
      cost: ingredientCost,
      date: new Date().toISOString(),
      consumptionDetails: consumptionDetails
    };
    
    // Update the lastProduced date for the recipe
    updateRecipe(recipe.id, { lastProduced: newProduction.date });
    
    return newProduction;
  } catch (error) {
    console.error('Error in handleAddProduction:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
