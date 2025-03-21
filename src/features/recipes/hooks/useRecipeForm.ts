
import { useState } from 'react';
import { Recipe, RecipeItem } from '@/store/recipeStore';
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
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'кг',
    lossPercentage: 0,
    items: [],
  });
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      output: 1,
      outputUnit: 'кг',
      lossPercentage: 0,
      items: [],
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
      items: recipe.items.map(item => {
        // Ensure backward compatibility for old recipe items
        if (!item.type) {
          return { 
            ...item, 
            type: 'ingredient' 
          };
        }
        return { ...item };
      }),
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
