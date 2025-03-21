
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Recipe, ProductionBatch } from '@/store/types';
import { useProductionValidation } from './useProductionValidation';
import { useResourceAvailability } from './useResourceAvailability';
import { useProductionSubmission } from './useProductionSubmission';

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
  initialFormData?: {
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  } | null;
  initialEditFormData?: {
    quantity: number;
    date: string;
  } | null;
}

export const useProductionForm = ({
  recipes,
  ingredients,
  productions,
  addProduction,
  updateProduction,
  calculateCost,
  checkSemiFinalAvailability,
  initialFormData = null,
  initialEditFormData = null
}: UseProductionFormProps) => {
  // Initialize form state
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }>(initialFormData || {
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    autoProduceSemiFinals: true,
  });
  
  const [editFormData, setEditFormData] = useState<{
    quantity: number;
    date: string;
  }>(initialEditFormData || {
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // Use validation hooks
  const { validateCreateForm, validateEditForm } = useProductionValidation(recipes);
  
  // Use resource availability hooks
  const { checkResourceAvailability, handleInsufficientResources } = useResourceAvailability({
    recipes,
    ingredients,
    checkSemiFinalAvailability
  });
  
  // Use submission hooks
  const { submitCreateProduction, submitEditProduction } = useProductionSubmission({
    addProduction,
    updateProduction,
    calculateCost
  });
  
  // Handle production creation
  const handleCreateProduction = useCallback(() => {
    console.log("Creating production with data:", formData);
    
    // Validate form data
    if (!validateCreateForm(formData.recipeId, formData.quantity)) {
      return false;
    }
    
    // Check resource availability (only if not auto-producing)
    if (!formData.autoProduceSemiFinals) {
      const { hasEnoughResources, insufficientResources } = checkResourceAvailability(
        formData.recipeId, 
        formData.quantity, 
        formData.autoProduceSemiFinals
      );
      
      if (!hasEnoughResources) {
        return handleInsufficientResources(insufficientResources);
      }
    }
    
    // Submit the production
    const success = submitCreateProduction(formData);
    
    if (success) {
      // Reset form after successful submission
      setFormData({
        recipeId: recipes.length > 0 ? recipes[0].id : '',
        quantity: 1,
        date: format(new Date(), 'yyyy-MM-dd'),
        autoProduceSemiFinals: true,
      });
    }
    
    return success;
  }, [
    formData, 
    recipes, 
    validateCreateForm, 
    checkResourceAvailability, 
    handleInsufficientResources, 
    submitCreateProduction
  ]);
  
  // Handle production edit
  const handleEditProduction = useCallback((selectedProduction: ProductionBatch | null) => {
    console.log("Editing production with data:", editFormData, "Selected production:", selectedProduction);
    
    if (!selectedProduction) return false;
    
    // Validate edit form data
    if (!validateEditForm(editFormData.quantity)) {
      return false;
    }
    
    // Submit the edit
    return submitEditProduction(
      selectedProduction.id,
      editFormData,
      selectedProduction.recipeId
    );
  }, [editFormData, validateEditForm, submitEditProduction]);

  return {
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  };
};
