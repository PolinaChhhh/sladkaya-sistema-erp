
import { useState } from 'react';
import { format } from 'date-fns';
import { Recipe, ProductionBatch } from '@/store/types';
import { toast } from 'sonner';

interface UseProductionFormProps {
  recipes: Recipe[];
  ingredients: any[];
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => { error?: boolean; insufficientItems?: Array<{name: string, required: number, available: number, unit: string}> };
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  calculateCost: (recipeId: string, quantity: number) => number;
  checkSemiFinalAvailability: (recipeId: string, quantity: number) => { 
    canProduce: boolean; 
    insufficientItems: Array<{name: string, required: number, available: number, unit: string}> 
  };
}

export const useProductionForm = ({
  recipes,
  ingredients,
  productions,
  addProduction,
  updateProduction,
  calculateCost,
  checkSemiFinalAvailability
}: UseProductionFormProps) => {
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    autoProduceSemiFinals: true, // Default to true for auto-production
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
      // For finished products, check if we need to auto-produce semi-finished products
      if (formData.autoProduceSemiFinals) {
        // We'll handle auto-production in the store, so no need to check availability here
      } else {
        // If not auto-producing, check availability
        const { canProduce, insufficientItems } = checkSemiFinalAvailability(formData.recipeId, formData.quantity);
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
    
    // Only show warning if we're not auto-producing and there are insufficient resources
    if (!formData.autoProduceSemiFinals && insufficientResources.length > 0) {
      const warningMessage = insufficientResources.map(res => 
        `${res.name}: требуется ${res.required.toFixed(2)} ${res.unit}, доступно ${res.available.toFixed(2)} ${res.unit}`
      ).join('\n');
      
      toast.error(`Недостаточно ресурсов:\n${warningMessage}`);
      return false;
    }
    
    // The cost will be calculated in the store
    const estimatedCost = calculateCost(formData.recipeId, formData.quantity);
    
    const result = addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost: estimatedCost,
      autoProduceSemiFinals: formData.autoProduceSemiFinals
    });
    
    // Check if there was an error during production
    if (result.error && result.insufficientItems) {
      const warningMessage = result.insufficientItems.map(res => 
        `${res.name}: требуется ${res.required.toFixed(2)} ${res.unit}, доступно ${res.available.toFixed(2)} ${res.unit}`
      ).join('\n');
      
      toast.error(`Недостаточно ресурсов:\n${warningMessage}`);
      return false;
    }
    
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

  return {
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  };
};
