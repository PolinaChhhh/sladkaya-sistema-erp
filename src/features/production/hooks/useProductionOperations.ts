
import { useCallback } from 'react';
import { useStore } from '@/store/recipeStore';
import { createProduction, deleteProduction } from '../utils/productionManager';
import { toast } from 'sonner';
import { ProductionBatch } from '@/store/types';

export const useProductionOperations = () => {
  const { 
    recipes, 
    ingredients, 
    receipts, 
    updateIngredient, 
    updateReceiptItem, 
    addProduction: storeAddProduction, 
    deleteProduction: storeDeleteProduction,
    updateRecipe,
    productions
  } = useStore();
  
  const addProduction = useCallback((data: {
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }) => {
    console.log("Creating production with data:", data);
    
    const result = createProduction(
      data.recipeId,
      data.quantity,
      data.date,
      data.autoProduceSemiFinals,
      recipes,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem,
      storeAddProduction,
      updateRecipe
    );
    
    if (!result.success) {
      console.error("Production creation failed:", result.errorMessage);
      
      if (result.insufficientItems && result.insufficientItems.length > 0) {
        const warningMessage = result.insufficientItems.map(res => 
          `${res.name}: требуется ${res.required.toFixed(2)} ${res.unit}, доступно ${res.available.toFixed(2)} ${res.unit}`
        ).join('\n');
        
        toast.error(`Недостаточно ресурсов:\n${warningMessage}`);
      } else {
        toast.error(result.errorMessage || 'Ошибка при создании производства');
      }
      
      return false;
    }
    
    toast.success('Запись о производстве добавлена');
    return true;
  }, [
    recipes, 
    ingredients, 
    receipts, 
    updateIngredient, 
    updateReceiptItem, 
    storeAddProduction,
    updateRecipe
  ]);
  
  const editProduction = useCallback((id: string, data: {
    quantity: number;
    date: string;
  }) => {
    console.log("Editing production:", id, data);
    
    // For now we just update the production and do not recalculate costs
    // In a real system we would need to:
    // 1. Restore the original ingredients
    // 2. Create a new production with new quantities
    // 3. Delete the old production
    
    // This is a simplified implementation
    const production = productions.find(p => p.id === id);
    if (!production) {
      toast.error('Производство не найдено');
      return false;
    }
    
    // In this simplified version, we're not recalculating costs
    storeDeleteProduction(id);
    
    const result = createProduction(
      production.recipeId,
      data.quantity,
      data.date,
      !!production.autoProduceSemiFinals,
      recipes,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem,
      storeAddProduction,
      updateRecipe
    );
    
    if (!result.success) {
      toast.error(result.errorMessage || 'Ошибка при обновлении производства');
      return false;
    }
    
    toast.success('Запись о производстве обновлена');
    return true;
  }, [
    productions,
    recipes, 
    ingredients, 
    receipts, 
    updateIngredient, 
    updateReceiptItem, 
    storeAddProduction,
    storeDeleteProduction,
    updateRecipe
  ]);
  
  const removeProduction = useCallback((id: string) => {
    console.log("Deleting production:", id);
    
    const success = deleteProduction(
      id,
      productions,
      recipes,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem,
      storeDeleteProduction
    );
    
    if (success) {
      toast.success('Запись о производстве удалена');
    } else {
      toast.error('Ошибка при удалении производства');
    }
    
    return success;
  }, [
    productions,
    recipes,
    ingredients,
    receipts,
    updateIngredient,
    updateReceiptItem,
    storeDeleteProduction
  ]);
  
  return {
    addProduction,
    editProduction,
    removeProduction
  };
};
