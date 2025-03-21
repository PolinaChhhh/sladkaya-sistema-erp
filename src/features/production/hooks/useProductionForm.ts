
import { useState } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { toast } from 'sonner';
import { checkIngredientsAvailability } from '@/store/utils/fifoCalculator';

export interface ProductionFormData {
  recipeId: string;
  quantity: number;
  date: string;
  autoProduceSemiFinals: boolean;
}

export const useProductionForm = () => {
  const { recipes, ingredients, addProduction, updateProduction } = useStore();
  
  const [createFormData, setCreateFormData] = useState<ProductionFormData>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: false
  });
  
  const [editFormData, setEditFormData] = useState<ProductionFormData>({
    recipeId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: false
  });
  
  const handleCreateProduction = () => {
    const recipe = recipes.find(r => r.id === createFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return;
    }
    
    if (createFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // Check if we have enough ingredients
    const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
      recipe,
      createFormData.quantity,
      ingredients
    );
    
    if (!canProduce) {
      toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
      return;
    }
    
    // Create production
    addProduction({
      recipeId: createFormData.recipeId,
      quantity: createFormData.quantity,
      date: new Date(createFormData.date).toISOString(),
      cost: 0, // This will be calculated by the store
      autoProduceSemiFinals: createFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно добавлено');
    return true;
  };
  
  const handleEditProduction = (selectedProduction: ProductionBatch | null) => {
    if (!selectedProduction) return false;
    
    const recipe = recipes.find(r => r.id === editFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return false;
    }
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // Check if we have enough ingredients for updated quantity
    if (editFormData.quantity > selectedProduction.quantity) {
      const additionalQuantity = editFormData.quantity - selectedProduction.quantity;
      
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe,
        additionalQuantity,
        ingredients
      );
      
      if (!canProduce) {
        toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
        return false;
      }
    }
    
    // Update production
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: new Date(editFormData.date).toISOString(),
      autoProduceSemiFinals: editFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно обновлено');
    return true;
  };
  
  return {
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  };
};
