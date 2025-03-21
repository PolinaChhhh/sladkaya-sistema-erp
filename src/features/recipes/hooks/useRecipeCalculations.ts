
import { useMemo } from 'react';
import { RecipeItem } from '@/store/recipeStore';

interface UseRecipeCalculationsProps {
  items: RecipeItem[];
  output: number;
  outputUnit: string;
  getIngredientUnit: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

export const useRecipeCalculations = ({
  items,
  output,
  outputUnit,
  getIngredientUnit,
  getRecipeUnit,
}: UseRecipeCalculationsProps) => {
  // Calculate total ingredients weight and loss percentage
  return useMemo(() => {
    // Sum up the weights of all ingredients and recipes (assuming all are in kg or convertible to kg)
    const total = items.reduce((sum, item) => {
      if (!item.amount) return sum;
      
      let weightInKg = item.amount;
      
      if (item.type === 'ingredient' && item.ingredientId) {
        const unit = getIngredientUnit(item.ingredientId);
        
        // Convert to kg if needed (simplified conversion)
        if (unit === 'г') {
          weightInKg = item.amount / 1000;
        }
      } else if (item.type === 'recipe' && item.recipeId) {
        const unit = getRecipeUnit(item.recipeId);
        
        // Convert to kg if needed (simplified conversion)
        if (unit === 'г') {
          weightInKg = item.amount / 1000;
        }
      } else {
        // Skip items with incomplete data
        return sum;
      }
      
      return sum + weightInKg;
    }, 0);
    
    // Calculate loss percentage based on output and total weight
    let lossPercentage = 0;
    if (total > 0 && outputUnit === 'кг') {
      // If output is less than ingredients, there's a loss
      lossPercentage = ((total - output) / total) * 100;
    }
    
    return { 
      totalIngredientsWeight: total, 
      calculatedLossPercentage: lossPercentage 
    };
  }, [items, output, outputUnit, getIngredientUnit, getRecipeUnit]);
};
