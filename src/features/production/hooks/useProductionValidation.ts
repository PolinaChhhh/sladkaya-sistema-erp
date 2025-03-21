
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Recipe } from '@/store/types';

export const useProductionValidation = (recipes: Recipe[]) => {
  // Validate production form data
  const validateCreateForm = useCallback((recipeId: string, quantity: number) => {
    console.log("Validating production form data:", { recipeId, quantity });
    
    if (!recipeId) {
      toast.error('Выберите рецепт');
      return false;
    }
    
    if (quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // Get the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      toast.error('Рецепт не найден');
      return false;
    }
    
    return true;
  }, [recipes]);

  // Validate edit form data
  const validateEditForm = useCallback((quantity: number) => {
    console.log("Validating edit form data:", { quantity });
    
    if (quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    return true;
  }, []);

  return {
    validateCreateForm,
    validateEditForm
  };
};
