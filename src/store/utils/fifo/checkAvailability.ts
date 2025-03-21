
import { Recipe } from '../../types';

/**
 * Check if there are enough ingredients available for production
 */
export const checkIngredientsAvailability = (
  recipe: Recipe,
  quantity: number,
  ingredients: any[],
  recipes: Recipe[],
  productions: any[],
  skipSemiFinalChecks: boolean = false
): { canProduce: boolean; insufficientIngredients: string[] } => {
  const insufficientIngredients: string[] = [];
  const productionRatio = quantity / recipe.output;
  
  // Check direct ingredients
  recipe.items
    .filter(item => item.type === 'ingredient' && item.ingredientId)
    .forEach(item => {
      const ingredientId = item.ingredientId as string;
      const ingredient = ingredients.find(i => i.id === ingredientId);
      
      if (ingredient) {
        const requiredAmount = item.amount * productionRatio;
        
        if (ingredient.quantity < requiredAmount) {
          insufficientIngredients.push(`${ingredient.name} (требуется ${requiredAmount.toFixed(2)} ${ingredient.unit}, в наличии ${ingredient.quantity.toFixed(2)} ${ingredient.unit})`);
        }
      } else {
        insufficientIngredients.push(`Ингредиент не найден (id: ${ingredientId})`);
      }
    });
  
  return {
    canProduce: insufficientIngredients.length === 0,
    insufficientIngredients
  };
};
