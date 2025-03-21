
import { useState } from 'react';
import { Recipe, RecipeItem, RecipeTag, RecipeCategory } from '@/store/types';
import { toast } from 'sonner';

interface UseRecipeFormProps {
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
}

export const useRecipeForm = ({ addRecipe, updateRecipe }: UseRecipeFormProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
    category: RecipeCategory;
    lossPercentage: number;
    tags: RecipeTag[];
    imageUrl?: string;
    preparationTime?: number;
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'шт',
    items: [],
    category: 'finished',
    lossPercentage: 0,
    tags: [],
    imageUrl: undefined,
    preparationTime: 0,
  });
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      output: 1,
      outputUnit: 'шт',
      items: [],
      category: 'finished',
      lossPercentage: 0,
      tags: [],
      imageUrl: undefined,
      preparationTime: 0,
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description,
      output: recipe.output,
      outputUnit: recipe.outputUnit,
      items: recipe.items || [],
      category: recipe.category || 'finished', 
      lossPercentage: recipe.lossPercentage || 0,
      tags: recipe.tags || [],
      imageUrl: recipe.imageUrl,
      preparationTime: recipe.preparationTime || 0,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCreateRecipe = () => {
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    addRecipe({
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
      lastProduced: null,
      category: formData.category,
      lossPercentage: formData.lossPercentage,
      tags: formData.tags,
      imageUrl: formData.imageUrl,
      preparationTime: formData.preparationTime,
    });
    
    toast.success(formData.category === 'finished' 
      ? 'Рецепт успешно создан' 
      : 'Полуфабрикат успешно создан');
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateRecipe = () => {
    if (!selectedRecipe) return;
    
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    updateRecipe(selectedRecipe.id, {
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
      category: formData.category,
      lossPercentage: formData.lossPercentage,
      tags: formData.tags,
      imageUrl: formData.imageUrl,
      preparationTime: formData.preparationTime,
    });
    
    toast.success(formData.category === 'finished' 
      ? 'Рецепт успешно обновлен' 
      : 'Полуфабрикат успешно обновлен');
    setIsEditDialogOpen(false);
  };

  return {
    formData,
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedRecipe,
    setSelectedRecipe,
    initCreateForm,
    initEditForm,
    handleCreateRecipe,
    handleUpdateRecipe
  };
};
