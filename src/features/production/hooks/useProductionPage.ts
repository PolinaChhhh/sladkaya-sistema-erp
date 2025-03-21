
import { useEffect } from 'react';
import { useStore } from '@/store/recipeStore';
import { useProductionOperations } from '@/features/production/hooks/useProductionOperations';

import { useProductionDialogState } from './useProductionDialogState';
import { useProductionFormState } from './useProductionFormState';
import { useProductionRecipeUtils } from './useProductionRecipeUtils';
import { useProductionIngredientUtils } from './useProductionIngredientUtils';
import { useProductionSemiFinalUtils } from './useProductionSemiFinalUtils';
import { useProductionOperationsHandler } from './useProductionOperationsHandler';
import { useProductionCostCalculation } from './useProductionCostCalculation';
import { useProductionSearchFilter } from './useProductionSearchFilter';

export const useProductionPage = () => {
  const { recipes, productions, ingredients, receipts } = useStore();
  const { addProduction, editProduction, removeProduction } = useProductionOperations();
  
  // Use dialog state hook
  const dialogState = useProductionDialogState();
  
  // Use form state hook
  const formState = useProductionFormState(recipes);
  
  // Use recipe utility hooks
  const recipeUtils = useProductionRecipeUtils(recipes);
  
  // Use cost calculation hook
  const { calculateCost } = useProductionCostCalculation(recipes, ingredients);
  
  // Use ingredient utility hooks
  const ingredientUtils = useProductionIngredientUtils(ingredients, recipes);
  
  // Use semi-final utility hooks
  const semiFinalUtils = useProductionSemiFinalUtils(recipes, calculateCost);
  
  // Use search filter hook
  const searchFilter = useProductionSearchFilter(productions, recipes);
  
  // Use operations handler hook
  const operationsHandler = useProductionOperationsHandler(
    addProduction,
    editProduction,
    removeProduction
  );
  
  // Update edit form data when selected production changes
  useEffect(() => {
    formState.updateEditFormDataFromProduction(dialogState.selectedProduction);
  }, [dialogState.selectedProduction]);
  
  // Get selected recipe
  const getSelectedRecipe = () => {
    if (!dialogState.selectedProduction) return null;
    return recipeUtils.getSelectedRecipe(dialogState.selectedProduction.recipeId);
  };
  
  // Handle form submission with dialog management
  const handleCreateProduction = () => {
    const success = operationsHandler.handleCreateProduction(formState.createFormData);
    if (success) {
      dialogState.setIsCreateDialogOpen(false);
      formState.resetCreateFormData();
    }
    return success;
  };
  
  const handleEditProduction = () => {
    if (!dialogState.selectedProduction) return false;
    
    const success = operationsHandler.handleEditProduction(
      dialogState.selectedProduction.id,
      formState.editFormData
    );
    
    if (success) {
      dialogState.setIsEditDialogOpen(false);
    }
    
    return success;
  };
  
  const handleDeleteProduction = () => {
    const success = operationsHandler.handleDeleteProduction(dialogState.selectedProduction);
    
    if (success) {
      dialogState.setIsDeleteDialogOpen(false);
    }
    
    return success;
  };

  return {
    ...dialogState,
    ...formState,
    ...recipeUtils,
    ...ingredientUtils,
    ...semiFinalUtils,
    ...searchFilter,
    filteredProductions: searchFilter.filteredProductions,
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    calculateCost,
    getSelectedRecipe
  };
};
