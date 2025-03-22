
import { Recipe, RecipeItem } from "@/store/types";

/**
 * Expands a semi-finished product into its ingredient components
 * with amounts scaled to the desired portion size
 */
export const expandSemiFinishedToIngredients = (
  semiFinishedRecipe: Recipe,
  desiredAmount: number,
  recipes: Recipe[]
): RecipeItem[] => {
  console.log(`Expanding ${semiFinishedRecipe.name} for ${desiredAmount}g - output: ${semiFinishedRecipe.output}`);
  
  // Calculate the scaling factor based on desired amount vs total output
  const scaleFactor = desiredAmount / semiFinishedRecipe.output;
  console.log(`Scale factor: ${scaleFactor}`);
  
  // Get all ingredients from the semi-finished recipe
  const expandedItems: RecipeItem[] = [];
  
  // Recursive function to expand nested semi-finished products
  const expandRecipeItems = (items: RecipeItem[], fromRecipe: Recipe, currentScaleFactor: number) => {
    items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        // For ingredients, just scale the amount and add to the result
        const scaledAmount = item.amount * currentScaleFactor;
        console.log(`Adding ingredient ${item.ingredientId} - amount: ${item.amount} × ${currentScaleFactor} = ${scaledAmount}`);
        
        expandedItems.push({
          type: 'ingredient',
          ingredientId: item.ingredientId,
          amount: scaledAmount,
          isPackaging: false,
          fromSemiFinished: {
            recipeId: fromRecipe.id,
            recipeName: fromRecipe.name
          }
        });
      } else if (item.type === 'recipe' && item.recipeId) {
        // For nested recipes, find the recipe and recursively expand it
        const nestedRecipe = recipes.find(r => r.id === item.recipeId);
        if (nestedRecipe) {
          // Calculate new scale factor for the nested recipe
          const nestedScaleFactor = (item.amount * currentScaleFactor) / nestedRecipe.output;
          console.log(`Recursively expanding ${nestedRecipe.name} with scale factor ${nestedScaleFactor}`);
          expandRecipeItems(nestedRecipe.items, nestedRecipe, nestedScaleFactor);
        } else {
          console.warn(`Recipe ${item.recipeId} not found - cannot expand further`);
        }
      }
    });
  };
  
  // Start the recursive expansion
  expandRecipeItems(semiFinishedRecipe.items, semiFinishedRecipe, scaleFactor);
  console.log(`Expanded to ${expandedItems.length} ingredients`);
  
  return expandedItems;
};
