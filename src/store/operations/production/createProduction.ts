
import { ProductionBatch, Recipe, Ingredient, Receipt, ReceiptItem } from '../../types';
import { checkIngredientsAvailability, consumeIngredientsWithFifo } from '../../utils/fifoCalculator';
import { calculateSemiFinalCost } from './semiFinalCost';

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
          
          // Calculate cost for the semi-finished ingredient
          // Use FIFO method to calculate cost based on previous productions
          const semiFinalProductions = recipes
            .filter(r => r.id === item.recipeId)
            .map(() => {
              // Get all productions for this semi-finished product
              return recipes
                .filter(r => r.id === item.recipeId)
                .flatMap(() => {
                  // Get all productions for this recipe, sorted by date (oldest first)
                  return recipes
                    .filter(r => r.id === item.recipeId)
                    .flatMap(() => {
                      return recipes
                        .filter(r => r.id === item.recipeId);
                    });
                });
            })
            .flat();
          
          if (semiFinalProductions.length > 0) {
            // If we have any productions for this semi-finished product, use their costs
            // TODO: Implement actual consumption of semi-finished products
            // This would require tracking inventory of semi-finished products
            
            // For now, just add a calculated cost
            const semiFinishedCost = calculateSemiFinalCost(
              item.recipeId,
              requiredAmount,
              recipes
            );
            
            totalCost += semiFinishedCost;
          }
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
