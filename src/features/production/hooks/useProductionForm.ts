
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
      return;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // Check if we have enough ingredients for production
    const recipe = recipes.find(r => r.id === formData.recipeId);
    if (recipe) {
      const productionRatio = formData.quantity / recipe.output;
      let insufficientIngredients = [];
      
      for (const item of recipe.items) {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (ingredient) {
            const requiredAmount = item.amount * productionRatio;
            if (ingredient.quantity < requiredAmount) {
              insufficientIngredients.push({
                name: ingredient.name,
                required: requiredAmount,
                available: ingredient.quantity,
                unit: ingredient.unit
              });
            }
          }
        }
      }
      
      if (insufficientIngredients.length > 0) {
        const warningMessage = insufficientIngredients.map(ing => 
          `${ing.name}: требуется ${ing.required.toFixed(2)} ${ing.unit}, доступно ${ing.available.toFixed(2)} ${ing.unit}`
        ).join('\n');
        
        toast.error(`Недостаточно ингредиентов:\n${warningMessage}`);
        return;
      }
    }
    
    // The cost will be calculated in the store using FIFO
    // This is just an estimate for display
    const estimatedCost = calculateCost(formData.recipeId, formData.quantity);
    
    addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost: estimatedCost, // The actual cost will be recalculated in the store using FIFO
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
    
    // The cost will be recalculated in the store based on FIFO
    // This is just an estimate for display
    const estimatedCost = calculateCost(selectedProduction.recipeId, editFormData.quantity);
    
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: editFormData.date,
      cost: estimatedCost, // The actual cost will be recalculated in the store using FIFO
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
