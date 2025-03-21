
import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '@/store/recipeStore';
import { toast } from 'sonner';

export const useProductionState = () => {
  const { recipes, ingredients, productions, addProduction, updateRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
  }>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const filteredProductions = productions.filter(production => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort productions by date (newest first)
  const sortedProductions = [...filteredProductions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const calculateCost = (recipeId: string, quantity: number): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    const recipeItems = recipe.items;
    let totalCost = 0;
    
    recipeItems.forEach(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        totalCost += (ingredient.cost * item.amount);
      }
    });
    
    // Calculate cost per output unit of recipe
    const costPerUnit = totalCost / recipe.output;
    
    // Calculate total cost for the production
    return costPerUnit * quantity;
  };
  
  const handleCreateProduction = () => {
    if (!formData.recipeId) {
      toast.error('Выберите рецепт');
      return;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    const cost = calculateCost(formData.recipeId, formData.quantity);
    
    addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost,
    });
    
    // Update the lastProduced date on the recipe
    updateRecipe(formData.recipeId, {
      lastProduced: formData.date,
    });
    
    toast.success('Запись о производстве добавлена');
    setIsCreateDialogOpen(false);
  };
  
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  return {
    searchQuery,
    setSearchQuery,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    formData,
    setFormData,
    sortedProductions,
    handleCreateProduction,
    calculateCost,
    getRecipeName,
    getRecipeOutput
  };
};
