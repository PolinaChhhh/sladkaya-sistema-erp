
import { ProductionBatch, Recipe, Ingredient, Receipt, ReceiptItem } from '../types';
import { 
  checkIngredientsAvailability, 
  consumeIngredientsWithFifo, 
  restoreIngredientsToReceipts 
} from '../utils/fifoCalculator';

export const createProduction = (
  production: Omit<ProductionBatch, 'id'>,
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void
): ProductionBatch | null => {
  const recipe = recipes.find(r => r.id === production.recipeId);
  
  if (recipe) {
    let totalCost = 0;
    
    // Update the last produced date for the recipe
    updateRecipe(recipe.id, {
      lastProduced: new Date().toISOString()
    });
    
    if (recipe.category === 'semi-finished') {
      // Handle semi-finished products with ingredients
      
      // Check if we have enough of each ingredient
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe, 
        production.quantity,
        ingredients
      );
      
      if (!canProduce) {
        console.error(`Cannot produce: Insufficient ingredients: ${insufficientIngredients.join(', ')}`);
        return null; // Don't add production if insufficient ingredients
      }
      
      // Calculate total cost using FIFO method for ingredients
      totalCost = consumeIngredientsWithFifo(
        recipe,
        production.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
    } else if (recipe.category === 'finished') {
      // Handle finished products with semi-finished ingredients
      
      // Calculate the cost of semi-finished products used
      const productionRatio = production.quantity / recipe.output;
      
      // Process each recipe item
      for (const item of recipe.items) {
        if (item.type === 'recipe' && item.recipeId) {
          const requiredAmount = item.amount * productionRatio;
          
          // Here we would reduce the available quantity of the semi-finished product
          // This would ideally be tracked in some inventory system
          
          // For now, just add a placeholder cost
          totalCost += requiredAmount * 100; // This should use actual costs from previous productions
        } else if (item.type === 'ingredient' && item.ingredientId) {
          // If a finished product also uses raw ingredients directly
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (ingredient) {
            const requiredAmount = item.amount * productionRatio;
            
            // Reduce the ingredient quantity
            updateIngredient(ingredient.id, {
              quantity: Math.max(0, ingredient.quantity - requiredAmount)
            });
            
            // Add to the cost
            totalCost += requiredAmount * ingredient.cost;
          }
        }
      }
    }
    
    // Return the new production with calculated cost
    return {
      ...production,
      cost: totalCost,
      id: crypto.randomUUID()
    };
  }
  
  // If no recipe found, just create a production with given data
  return { 
    ...production, 
    id: crypto.randomUUID() 
  };
};

export const updateProductionBatch = (
  id: string,
  data: Partial<ProductionBatch>,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): ProductionBatch[] => {
  const originalProduction = productions.find(production => production.id === id);
  
  if (!originalProduction) {
    return productions;
  }

  // If the quantity has changed, we need to adjust the ingredient quantities
  if (data.quantity !== undefined && data.quantity !== originalProduction.quantity) {
    const recipe = recipes.find(r => r.id === originalProduction.recipeId);
    
    if (recipe) {
      // First, restore the ingredients used in the original production
      restoreIngredientsToReceipts(
        recipe,
        originalProduction.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );

      // Calculate the new ratio and check if we have enough ingredients
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe,
        data.quantity as number,
        ingredients
      );
      
      if (!canProduce) {
        console.error(`Cannot update production: Insufficient ingredients: ${insufficientIngredients.join(', ')}`);
        
        // Revert the restoration since we can't update
        // Re-consume the original amounts
        consumeIngredientsWithFifo(
          recipe,
          originalProduction.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        return productions;
      }
      
      // Calculate new cost using FIFO
      const totalCost = consumeIngredientsWithFifo(
        recipe,
        data.quantity as number,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
      
      // Update the cost with our calculated FIFO cost
      data.cost = totalCost;
    }
  }

  // Update the production with new data
  return productions.map((production) => 
    production.id === id ? { ...production, ...data } : production
  );
};

export const deleteProductionBatch = (
  id: string,
  productions: ProductionBatch[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  receipts: Receipt[],
  updateIngredient: (id: string, data: Partial<Ingredient>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void
): ProductionBatch[] => {
  const productionToDelete = productions.find(p => p.id === id);
  
  if (productionToDelete) {
    // Get the recipe for this production
    const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
    
    if (recipe) {
      // Restore ingredients and update receipt items
      restoreIngredientsToReceipts(
        recipe,
        productionToDelete.quantity,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem
      );
    }
  }
  
  // Remove the production
  return productions.filter((production) => production.id !== id);
};
