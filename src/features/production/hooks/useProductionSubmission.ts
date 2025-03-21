
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ProductionBatch } from '@/store/types';

interface ProductionSubmissionProps {
  addProduction: (production: Omit<ProductionBatch, 'id'>) => { 
    error?: boolean; 
    insufficientItems?: Array<{name: string, required: number, available: number, unit: string}> 
  };
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  calculateCost: (recipeId: string, quantity: number) => number;
}

export const useProductionSubmission = ({
  addProduction,
  updateProduction,
  calculateCost
}: ProductionSubmissionProps) => {
  
  // Submit create production form
  const submitCreateProduction = useCallback((formData: {
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }) => {
    console.log("Submitting create production with data:", formData);
    
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
  }, [addProduction, calculateCost]);

  // Submit edit production form
  const submitEditProduction = useCallback((
    productionId: string,
    formData: {
      quantity: number;
      date: string;
    },
    recipeId: string
  ) => {
    console.log("Submitting edit production with data:", formData, "for production:", productionId);
    
    // The cost will be recalculated
    const estimatedCost = calculateCost(recipeId, formData.quantity);
    
    updateProduction(productionId, {
      quantity: formData.quantity,
      date: formData.date,
      cost: estimatedCost,
    });
    
    toast.success('Запись о производстве обновлена');
    return true;
  }, [updateProduction, calculateCost]);

  return {
    submitCreateProduction,
    submitEditProduction
  };
};
