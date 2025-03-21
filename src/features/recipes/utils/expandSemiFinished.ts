
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
  // Calculate the scaling factor based on desired amount vs total output
  const scaleFactor = desiredAmount / semiFinishedRecipe.output;
  
  // Get all ingredients from the semi-finished recipe
  const expandedItems: RecipeItem[] = [];
  
  // Recursive function to expand nested semi-finished products
  const expandRecipeItems = (items: RecipeItem[], fromRecipe: Recipe, currentScaleFactor: number) => {
    items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        // For ingredients, just scale the amount and add to the result
        expandedItems.push({
          type: 'ingredient',
          ingredientId: item.ingredientId,
          amount: item.amount * currentScaleFactor,
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
          expandRecipeItems(nestedRecipe.items, nestedRecipe, nestedScaleFactor);
        }
      }
    });
  };
  
  // Start the recursive expansion
  expandRecipeItems(semiFinishedRecipe.items, semiFinishedRecipe, scaleFactor);
  
  return expandedItems;
};
