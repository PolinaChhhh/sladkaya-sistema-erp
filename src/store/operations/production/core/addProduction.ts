
import { ProductionBatch, Recipe } from '../../../types';
import { consumeIngredientsWithFifo } from '../../../utils/fifoCalculator';
import { consumeSemiFinalProducts } from '../../../utils/semiFinalProductUtils';
import { autoProduceSemiFinals } from './autoProduceSemiFinals';

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
      updateRecipe
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
  
  // Handle semi-finished products in recipe
  const semiFinalCost = consumeSemiFinalProducts(
    recipe,
    production.quantity,
    recipes,
    productions,
    updateProduction
  );
  
  // Add semi-final cost to total cost
  const totalCost = ingredientCost + semiFinalCost;
  
  // Create new production with calculated cost
  const newProduction = {
    ...production,
    id: crypto.randomUUID(),
    cost: totalCost,
    date: new Date().toISOString(),
    consumptionDetails // Store the consumption details with the production
  };
  
  // Update the lastProduced date for the recipe
  updateRecipe(recipe.id, { lastProduced: newProduction.date });
  
  return newProduction;
};
