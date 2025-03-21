
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ProductionBatch } from '@/store/types';

export const useProductionOperationsHandler = (
  addProduction: (data: any) => { error?: boolean; insufficientItems?: any[] },
  editProduction: (id: string, data: any) => boolean,
  removeProduction: (id: string) => boolean
) => {
  // Form submission handlers
  const handleCreateProduction = useCallback((formData: any) => {
    if (!formData.recipeId) {
      toast.error('Выберите рецепт');
      return { error: true };
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше нуля');
      return { error: true };
    }
    
    const result = addProduction(formData);
    
    if (result.error) {
      if (result.insufficientItems && result.insufficientItems.length > 0) {
        toast.error('Недостаточно ингредиентов для производства');
      } else {
        toast.error('Не удалось создать производство');
      }
      return result;
    }
    
    toast.success('Производство создано');
    return { error: false };
  }, [addProduction]);
  
  const handleEditProduction = useCallback((productionId: string, formData: any) => {
    if (!productionId) {
      toast.error('Производство не выбрано');
      return false;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше нуля');
      return false;
    }
    
    const success = editProduction(productionId, formData);
    
    if (!success) {
      toast.error('Не удалось обновить производство');
      return false;
    }
    
    toast.success('Производство обновлено');
    return true;
  }, [editProduction]);
  
  const handleDeleteProduction = useCallback((production: ProductionBatch | null) => {
    if (!production) {
      toast.error('Производство не выбрано');
      return false;
    }
    
    const success = removeProduction(production.id);
    
    if (!success) {
      toast.error('Не удалось удалить производство');
      return false;
    }
    
    toast.success('Производство удалено');
    return true;
  }, [removeProduction]);

  return {
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction
  };
};
