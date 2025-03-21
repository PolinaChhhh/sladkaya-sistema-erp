
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
          const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
          
          if (semiFinalRecipe) {
            // Auto-produce semi-finals if the option is enabled
            if (production.autoProduceSemiFinals) {
              // Calculate how many batches of semi-final we need to produce
              const semiFinalQuantityNeeded = requiredAmount;
              
              // Create a new production batch for this semi-final
              const semiFinalProduction: Omit<ProductionBatch, 'id'> = {
                recipeId: item.recipeId,
                quantity: semiFinalQuantityNeeded,
                date: production.date, // Use the same date
                cost: 0, // This will be calculated in the recursive call
              };
              
              // Recursively call createProduction to produce the semi-final
              const semiFinalBatch = createProduction(
                semiFinalProduction,
                recipes,
                ingredients,
                receipts,
                updateIngredient,
                updateReceiptItem,
                updateRecipe
              );
              
              if (semiFinalBatch) {
                // If successfully produced, add its cost to the total
                totalCost += semiFinalBatch.cost;
              } else {
                console.error(`Failed to auto-produce semi-final: ${semiFinalRecipe.name}`);
                // If auto-production fails, we should also fail the main production
                return null;
              }
            } else {
              // If auto-production is disabled, calculate cost from existing semi-finals
              const semiFinishedCost = calculateSemiFinalCost(
                item.recipeId,
                requiredAmount,
                recipes
              );
              
              totalCost += semiFinishedCost;
            }
          }
        } else if (item.type === 'ingredient' && item.ingredientId) {
          // If a finished product also uses raw ingredients directly
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (ingredient) {
            const requiredAmount = item.amount * productionRatio;
            
            // Check if we have enough of the ingredient
            if (ingredient.quantity < requiredAmount) {
              console.error(`Insufficient ingredient: ${ingredient.name}`);
              return null; // Don't add production if insufficient ingredients
            }
            
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
