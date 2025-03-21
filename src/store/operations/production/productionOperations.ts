
import { Recipe, ProductionBatch } from '../../types';
import { consumeIngredientsWithFifo, restoreIngredientsToReceipts } from '../../utils/fifoCalculator';
import { consumeSemiFinalProducts, restoreSemiFinalProducts } from '../../utils/semiFinalProductUtils';

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

/**
 * Auto-produces any required semi-final products
 */
const autoProduceSemiFinals = (
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  productions: ProductionBatch[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void
): void => {
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
      
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Calculate available quantity of this semi-finished product
        const availableQuantity = productions
          .filter(p => p.recipeId === semiFinalId)
          .reduce((total, p) => total + p.quantity, 0);
        
        // If we don't have enough, produce more
        if (availableQuantity < amountNeeded) {
          const amountToCreate = amountNeeded - availableQuantity;
          console.log(`Auto-producing ${amountToCreate} ${semiFinalRecipe.outputUnit} of ${semiFinalRecipe.name}`);
          
          // Create a new production of this semi-final product
          const semiFinalProduction: Omit<ProductionBatch, 'id'> = {
            recipeId: semiFinalId,
            quantity: amountToCreate,
            date: new Date().toISOString(),
            cost: 0, // Will be calculated in handleAddProduction
            autoProduceSemiFinals: true // Recursively auto-produce any required semi-finals
          };
          
          // Add the semi-final production
          handleAddProduction(
            semiFinalProduction,
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
      }
    });
};

/**
 * Handles updating an existing production batch
 */
export const handleUpdateProduction = (
  id: string,
  data: Partial<ProductionBatch>,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): Partial<ProductionBatch> => {
  const originalProduction = productions.find(p => p.id === id);
  
  if (!originalProduction) {
    console.error('Production not found');
    return data;
  }
  
  // If quantity changed, recalculate ingredient consumption
  if (data.quantity && data.quantity !== originalProduction.quantity) {
    const recipe = recipes.find(r => r.id === originalProduction.recipeId);
    
    if (recipe) {
      // First restore the original ingredients
      restoreIngredientsToReceipts(
        recipe,
        originalProduction.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // Also restore semi-finished products
      restoreSemiFinalProducts(
        recipe,
        originalProduction.quantity,
        recipes,
        productions,
        updateProduction
      );
      
      // Then consume the new amount of ingredients
      let newCost = consumeIngredientsWithFifo(
        recipe,
        data.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // And consume new amount of semi-finished products
      const semiFinalCost = consumeSemiFinalProducts(
        recipe,
        data.quantity,
        recipes,
        productions,
        updateProduction
      );
      
      // Update the cost along with other changes
      newCost += semiFinalCost;
      data.cost = newCost;
    }
  }
  
  return data;
};

/**
 * Handles deleting a production batch
 */
export const handleDeleteProduction = (
  id: string,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): void => {
  const productionToDelete = productions.find(p => p.id === id);
  
  if (!productionToDelete) {
    console.error('Production not found');
    return;
  }
  
  const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
  
  if (recipe) {
    // Restore ingredients back to receipts
    restoreIngredientsToReceipts(
      recipe,
      productionToDelete.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Restore semi-finished products
    restoreSemiFinalProducts(
      recipe,
      productionToDelete.quantity,
      recipes,
      productions,
      updateProduction
    );
  }
};
