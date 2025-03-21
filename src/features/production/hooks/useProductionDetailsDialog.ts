
import { useState } from 'react';
import { ProductionBatch, Recipe } from '@/store/types';
import { useProductionDetails } from './useProductionDetails';

export const useProductionDetailsDialog = () => {
  const {
    isDetailDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    selectedProduction,
    selectedRecipe,
    getIngredientDetails,
    getRecipeName,
    getIngredientUsageDetails,
    getSemiFinalBreakdown
  } = useProductionDetails();

  return {
    isDetailDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    selectedProduction,
    selectedRecipe,
    getIngredientDetails,
    getRecipeName,
    getIngredientUsageDetails,
    getSemiFinalBreakdown
  };
};
