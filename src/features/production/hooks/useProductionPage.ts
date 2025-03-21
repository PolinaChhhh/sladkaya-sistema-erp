import { useEffect } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch, Recipe } from '@/store/types';
import { useProductionForm, ProductionFormData } from './useProductionForm';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionFilter } from './useProductionFilter';
import { getIngredientDetails, calculateTotalCost } from '../utils/calculations';
import { 
  getIngredientUsageDetails, 
  getSemiFinalBreakdown 
} from '../utils/fifo';
import { getRecipeName, getRecipeOutput, getSelectedRecipe } from '../utils/recipeUtils';

export type { ProductionFormData } from './useProductionForm';

export const useProductionPage = () => {
  const { 
    productions, 
    recipes,
    ingredients,
    receipts,
    isLoading,
    error
  } = useStore();
  
  const {
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  } = useProductionForm();
  
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedProduction,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openDetailDialog,
    handleDeleteProduction
  } = useProductionDialogs();
  
  const {
    searchQuery,
    setSearchQuery,
    filteredProductions
  } = useProductionFilter(productions, recipes);
  
  // Update createFormData when recipes change (for initial load)
  useEffect(() => {
    if (recipes.length > 0 && createFormData.recipeId === '') {
      setCreateFormData(prevState => ({
        ...prevState,
        recipeId: recipes[0].id
      }));
    }
  }, [recipes, createFormData.recipeId, setCreateFormData]);
  
  // Wrapped functions to connect everything
  const handleCreateProductionSubmit = () => {
    const success = handleCreateProduction();
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };
  
  const handleEditProductionSubmit = () => {
    const success = handleEditProduction(selectedProduction);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };
  
  const handleOpenEditDialog = (production: ProductionBatch) => {
    openEditDialog(production, setEditFormData);
  };
  
  // Utility functions with proper dependencies injected
  const getRecipeNameWrapped = (id: string): string => getRecipeName(id, recipes);
  
  const getRecipeOutputWrapped = (id: string): string => getRecipeOutput(id, recipes);
  
  const getSelectedRecipeWrapped = (): Recipe | null => {
    if (!selectedProduction) return null;
    return getSelectedRecipe(selectedProduction.id, productions, recipes);
  };
  
  const getIngredientDetailsWrapped = (recipeId: string, quantity: number) => {
    return getIngredientDetails(recipes, recipeId, quantity, ingredients);
  };
  
  const getIngredientUsageDetailsWrapped = (recipeId: string, quantity: number) => {
    // Pass the selected production to get actual consumption details
    return getIngredientUsageDetails(
      recipeId, 
      quantity, 
      recipes, 
      ingredients, 
      receipts, 
      selectedProduction
    );
  };
  
  const getSemiFinalBreakdownWrapped = (recipeId: string, quantity: number) => {
    // Pass the selected production to get FIFO details for semi-finals
    return getSemiFinalBreakdown(
      recipeId, 
      quantity, 
      recipes, 
      ingredients,
      productions,  // Pass the productions array
      selectedProduction  // Pass the selected production for consumption details
    );
  };
  
  const calculateTotalCostWrapped = (recipeId: string, quantity: number) => {
    return calculateTotalCost(recipes, recipeId, quantity, ingredients);
  };
  
  return {
    // Loading and error states
    isLoading,
    error,
    
    // Search and filtering
    searchQuery,
    setSearchQuery,
    filteredProductions,
    
    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    
    // Form data
    selectedProduction,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    
    // Actions
    openCreateDialog,
    handleCreateProduction: handleCreateProductionSubmit,
    handleEditProduction: handleEditProductionSubmit,
    handleDeleteProduction,
    
    // Utility functions
    getRecipeName: getRecipeNameWrapped,
    getRecipeOutput: getRecipeOutputWrapped,
    getIngredientDetails: getIngredientDetailsWrapped,
    getIngredientUsageDetails: getIngredientUsageDetailsWrapped,
    getSemiFinalBreakdown: getSemiFinalBreakdownWrapped,
    calculateTotalCost: calculateTotalCostWrapped,
    getSelectedRecipe: getSelectedRecipeWrapped,
    
    // Dialog openers
    openEditDialog: handleOpenEditDialog,
    openDeleteDialog,
    openDetailDialog
  };
};
