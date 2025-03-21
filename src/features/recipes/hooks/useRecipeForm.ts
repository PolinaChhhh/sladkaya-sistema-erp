
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
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'шт',
    items: [],
    category: 'finished',
    lossPercentage: 0,
    tags: [],
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
      // Ensure correct type for items
      items: recipe.items.map(item => {
        if (item.type === 'recipe') {
          return { 
            type: 'ingredient' as const,
            ingredientId: '', 
            amount: 0,
            isPackaging: false
          };
        }
        return { ...item, type: 'ingredient' as const };
      }).filter(item => !item.isPackaging), // Only keep non-packaging items
      category: recipe.category || 'finished', 
      lossPercentage: recipe.lossPercentage || 0,
      tags: recipe.tags || [], 
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
