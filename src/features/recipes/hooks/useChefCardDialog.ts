
import { useState } from 'react';
import { Recipe } from '@/store/types';

export const useChefCardDialog = () => {
  const [isChefCardOpen, setIsChefCardOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const openChefCard = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsChefCardOpen(true);
  };
  
  const closeChefCard = () => {
    setIsChefCardOpen(false);
  };
  
  return {
    isChefCardOpen,
    selectedRecipe,
    openChefCard,
    closeChefCard
  };
};
