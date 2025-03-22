
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
  
  // Process each ingredient in the semi-finished recipe
  semiFinishedRecipe.items.forEach(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      // For ingredients, scale the amount and add to the result
      const scaledAmount = item.amount * scaleFactor;
      console.log(`Adding ingredient ${item.ingredientId} - amount: ${item.amount} × ${scaleFactor} = ${scaledAmount}`);
      
      expandedItems.push({
        type: 'ingredient',
        ingredientId: item.ingredientId,
        amount: scaledAmount,
        isPackaging: false,
        fromSemiFinished: {
          recipeId: semiFinishedRecipe.id,
          recipeName: semiFinishedRecipe.name
        }
      });
    } 
    // We ignore recipe items since we're simplifying the model
  });

  console.log(`Expanded to ${expandedItems.length} ingredients`);
  return expandedItems;
};
