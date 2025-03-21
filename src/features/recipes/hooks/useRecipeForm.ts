
import { useState } from 'react';
import { Recipe, RecipeItem, RecipeTag } from '@/store/recipeStore';
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
    lossPercentage: number;
    items: RecipeItem[];
    category: 'finished';
    tags: RecipeTag[];
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'шт',
    lossPercentage: 0,
    items: [],
    category: 'finished',
    tags: [],
  });
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      output: 1,
      outputUnit: 'шт',
      lossPercentage: 0,
      items: [],
      category: 'finished',
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
      lossPercentage: recipe.lossPercentage || 0,
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
        return { ...item };
      }).filter(item => item.type === 'ingredient'), // Only keep ingredient items
      category: 'finished', 
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
      lossPercentage: formData.lossPercentage,
      lastProduced: null,
      category: 'finished',
      tags: formData.tags,
    });
    
    toast.success('Рецепт успешно создан');
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
      lossPercentage: formData.lossPercentage,
      category: 'finished',
      tags: formData.tags,
    });
    
    toast.success('Рецепт успешно обновлен');
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
