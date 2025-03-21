
import { useState } from 'react';
import { format } from 'date-fns';
import { Recipe, ProductionBatch } from '@/store/types';
import { toast } from 'sonner';

interface UseProductionFormProps {
  recipes: Recipe[];
  ingredients: any[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  calculateCost: (recipeId: string, quantity: number) => number;
}

export const useProductionForm = ({
  recipes,
  ingredients,
  addProduction,
  updateProduction,
  calculateCost
}: UseProductionFormProps) => {
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
  }>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const [editFormData, setEditFormData] = useState<{
    quantity: number;
    date: string;
  }>({
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const handleCreateProduction = () => {
    if (!formData.recipeId) {
      toast.error('Выберите рецепт');
      return false;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // Get the recipe
    const recipe = recipes.find(r => r.id === formData.recipeId);
    if (!recipe) {
      toast.error('Рецепт не найден');
      return false;
    }
    
    const productionRatio = formData.quantity / recipe.output;
    let insufficientResources = [];
    
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
      // For finished products, check semi-finished product availability
      for (const item of recipe.items) {
        if (item.type === 'recipe' && item.recipeId) {
          const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
          if (semiFinalRecipe) {
            // Calculate how much of this semi-finished product we need
            const requiredAmount = item.amount * productionRatio;
            
            // Calculate how much of this semi-finished product we have in stock
            const availableAmount = calculateAvailableSemiFinalQuantity(item.recipeId, recipes);
            
            if (availableAmount < requiredAmount) {
              insufficientResources.push({
                name: semiFinalRecipe.name,
                required: requiredAmount,
                available: availableAmount,
                unit: semiFinalRecipe.outputUnit
              });
            }
          }
        }
      }
    }
    
    if (insufficientResources.length > 0) {
      const warningMessage = insufficientResources.map(res => 
        `${res.name}: требуется ${res.required.toFixed(2)} ${res.unit}, доступно ${res.available.toFixed(2)} ${res.unit}`
      ).join('\n');
      
      toast.error(`Недостаточно ресурсов:\n${warningMessage}`);
      return false;
    }
    
    // The cost will be calculated in the store
    const estimatedCost = calculateCost(formData.recipeId, formData.quantity);
    
    addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost: estimatedCost,
    });
    
    toast.success('Запись о производстве добавлена');
    return true;
  };
  
  const handleEditProduction = (selectedProduction: ProductionBatch | null) => {
    if (!selectedProduction) return false;
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // The cost will be recalculated in the store
    const estimatedCost = calculateCost(selectedProduction.recipeId, editFormData.quantity);
    
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: editFormData.date,
      cost: estimatedCost,
    });
    
    toast.success('Запись о производстве обновлена');
    return true;
  };

  // Helper function to calculate available semi-final quantity
  const calculateAvailableSemiFinalQuantity = (recipeId: string, allRecipes: Recipe[]): number => {
    const semiFinalProductions = recipes
      .filter(r => r.id === recipeId)
      .map(recipe => {
        // Here you would get the total produced amount minus any consumed amount
        // For simplicity, you can start with just a placeholder
        return 10; // This should be calculated properly from production history
      });
    
    return semiFinalProductions.length > 0 ? semiFinalProductions[0] : 0;
  };

  return {
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  };
};
