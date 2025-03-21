
import { useState } from 'react';
import { Recipe } from '@/store/recipeStore';
import { toast } from 'sonner';

interface UseRecipeDeleteProps {
  deleteRecipe: (id: string) => void;
}

export const useRecipeDelete = ({ deleteRecipe }: UseRecipeDeleteProps) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const initDeleteConfirm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteRecipe = () => {
    if (!selectedRecipe) return;
    
    deleteRecipe(selectedRecipe.id);
    toast.success('Рецепт успешно удален');
    setIsDeleteConfirmOpen(false);
  };
  
  return {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedRecipe,
    initDeleteConfirm,
    handleDeleteRecipe
  };
};
