
import { ProductionBatch, Recipe } from '../../../types';
import { consumeIngredientsWithFifo } from '../../../utils/fifo/consumeIngredients';
import { consumeSemiFinalProductsWithFifo } from '../../../utils/fifo/consumeSemiFinals';
import { autoProduceSemiFinals } from './autoProduceSemiFinals';
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
  
  // Check if there are enough ingredients and semi-finals available
  const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
    recipe,
    production.quantity,
    ingredients,
    recipes,
    productions,
    !!production.autoProduceSemiFinals
  );
  
  if (!canProduce && !production.autoProduceSemiFinals) {
    throw new Error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
  }
  
  try {
    // Auto-produce semi-finals if needed
    if (production.autoProduceSemiFinals) {
      autoProduceSemiFinals(
        recipe,
        production.quantity,
        recipes,
        ingredients,
        receipts,
        productions,
        updateIngredient,
        updateReceiptItem,
        updateProduction,
        updateRecipe,
        // Pass the semiFinalsToProduce if it exists in the production object
        (production as any).semiFinalsToProduce
      );
    }
    
    // Calculate cost using FIFO method for direct ingredients
    const { totalCost: ingredientCost, consumptionDetails } = consumeIngredientsWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Handle semi-finished products in recipe using FIFO
    const { totalCost: semiFinalCost, consumptionDetails: semiFinalConsumptionDetails } = 
      consumeSemiFinalProductsWithFifo(
        recipe,
        production.quantity,
        recipes,
        productions,
        updateProduction
      );
    
    // Add semi-final cost to total cost
    const totalCost = ingredientCost + semiFinalCost;
    
    // Create new production with calculated cost and consumption details
    const newProduction = {
      ...production,
      id: crypto.randomUUID(),
      cost: totalCost,
      date: new Date().toISOString(),
      consumptionDetails, // Store the ingredient consumption details
      semiFinalConsumptionDetails // Store the semi-final consumption details
    };
    
    // Update the lastProduced date for the recipe
    updateRecipe(recipe.id, { lastProduced: newProduction.date });
    
    return newProduction;
  } catch (error) {
    console.error('Error in handleAddProduction:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
