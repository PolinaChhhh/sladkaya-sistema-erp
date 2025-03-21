
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Recipe, ProductionBatch } from '@/store/types';

interface ResourceAvailabilityProps {
  recipes: Recipe[];
  ingredients: any[];
  checkSemiFinalAvailability: (recipeId: string, quantity: number) => { 
    canProduce: boolean; 
    insufficientItems: Array<{name: string, required: number, available: number, unit: string}> 
  };
}

export const useResourceAvailability = ({
  recipes,
  ingredients,
  checkSemiFinalAvailability
}: ResourceAvailabilityProps) => {
  
  // Check if there are enough resources to produce
  const checkResourceAvailability = useCallback((
    recipeId: string, 
    quantity: number, 
    autoProduceSemiFinals: boolean
  ) => {
    console.log("Checking resource availability:", { recipeId, quantity, autoProduceSemiFinals });
    
    // Get the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return { hasEnoughResources: false, insufficientResources: [] };
    
    const productionRatio = quantity / recipe.output;
    let insufficientResources: Array<{name: string, required: number, available: number, unit: string}> = [];
    
    // Process differently based on recipe category
    if (recipe.category === 'semi-finished') {
      // For semi-finished products, check ingredient availability
      for (const item of recipe.items) {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (ingredient) {
            const requiredAmount = item.amount * productionRatio;
            if (ingredient.quantity < requiredAmount) {
              insufficientResources.push({
                name: ingredient.name,
                required: requiredAmount,
                available: ingredient.quantity,
                unit: ingredient.unit
              });
            }
          }
        }
      }
    } else if (recipe.category === 'finished') {
      // For finished products, check if we need to auto-produce semi-finished products
      if (autoProduceSemiFinals) {
        // We'll handle auto-production in the store, so no need to check availability here
      } else {
        // If not auto-producing, check availability
        const { canProduce, insufficientItems } = checkSemiFinalAvailability(recipeId, quantity);
        if (!canProduce) {
          insufficientResources = insufficientItems;
        }
        
        // Also check if there are any raw ingredients needed
        for (const item of recipe.items) {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = ingredients.find(i => i.id === item.ingredientId);
            if (ingredient) {
              const requiredAmount = item.amount * productionRatio;
              if (ingredient.quantity < requiredAmount) {
                insufficientResources.push({
                  name: ingredient.name,
                  required: requiredAmount,
                  available: ingredient.quantity,
                  unit: ingredient.unit
                });
              }
            }
          }
        }
      }
    }
    
    return { 
      hasEnoughResources: insufficientResources.length === 0,
      insufficientResources 
    };
  }, [recipes, ingredients, checkSemiFinalAvailability]);

  // Display warning for insufficient resources
  const handleInsufficientResources = useCallback((insufficientResources: Array<{name: string, required: number, available: number, unit: string}>) => {
    if (insufficientResources.length > 0) {
      const warningMessage = insufficientResources.map(res => 
        `${res.name}: требуется ${res.required.toFixed(2)} ${res.unit}, доступно ${res.available.toFixed(2)} ${res.unit}`
      ).join('\n');
      
      toast.error(`Недостаточно ресурсов:\n${warningMessage}`);
      return false;
    }
    return true;
  }, []);

  return {
    checkResourceAvailability,
    handleInsufficientResources
  };
};
