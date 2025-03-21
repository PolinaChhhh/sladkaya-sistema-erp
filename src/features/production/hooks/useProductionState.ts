
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { useProductionForm } from './useProductionForm';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionUtils } from './useProductionUtils';
import { useProductionSearch } from './useProductionSearch';
import { useProductionStorage } from './useProductionStorage';
import { useProductionFilters } from './useProductionFilters';
import { useProductionCost } from './useProductionCost';
import { useProductionActions } from './useProductionActions';

export const useProductionState = () => {
  const { recipes, ingredients, productions, addProduction, updateProduction, deleteProduction, receipts } = useStore();
  
  // Use search hook
  const { searchQuery, setSearchQuery } = useProductionSearch();
  
  // Use storage hook
  const { 
    getInitialFormData, 
    getInitialEditFormData, 
    saveFormData,
    saveEditFormData
  } = useProductionStorage();
  
  // Use production utilities
  const { 
    getRecipeName, 
    getRecipeOutput, 
    checkSemiFinalAvailability 
  } = useProductionUtils(recipes, productions);
  
  // Use cost calculation hooks
  const { calculateCost, calculateSemiFinishedCosts } = useProductionCost(
    recipes, 
    ingredients, 
    receipts, 
    productions
  );
  
  // Use production filters
  const { sortedProductions } = useProductionFilters(
    productions,
    recipes,
    searchQuery
  );
  
  // Hook for dialog state
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduction,
    openEditDialog,
    openDeleteDialog
  } = useProductionDialogs();
  
  // Hook for form state and handling
  const { 
    formData, 
    setFormData: originalSetFormData, 
    editFormData, 
    setEditFormData: originalSetEditFormData, 
    handleCreateProduction, 
    handleEditProduction 
  } = useProductionForm({
    recipes,
    ingredients,
    productions,
    addProduction,
    updateProduction,
    calculateCost,
    checkSemiFinalAvailability,
    initialFormData: getInitialFormData(),
    initialEditFormData: getInitialEditFormData()
  });
  
  // Wrap setFormData to save to localStorage
  const setFormData = useCallback((data: any) => {
    originalSetFormData(data);
    saveFormData(data);
  }, [originalSetFormData, saveFormData]);
  
  // Wrap setEditFormData to save to localStorage
  const setEditFormData = useCallback((data: any) => {
    originalSetEditFormData(data);
    saveEditFormData(data);
  }, [originalSetEditFormData, saveEditFormData]);
  
  // Use actions hook
  const { 
    onCreateProduction,
    onEditProduction,
    onDeleteProduction
  } = useProductionActions(
    handleCreateProduction,
    handleEditProduction,
    deleteProduction,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduction,
    formData,
    editFormData
  );
  
  // Persistence effect for edit form data when selectedProduction changes
  useEffect(() => {
    if (selectedProduction) {
      const newFormData = {
        quantity: selectedProduction.quantity,
        date: selectedProduction.date.split('T')[0], // Format date for input
      };
      setEditFormData(newFormData);
      console.log("Updated edit form data for production:", selectedProduction.id, newFormData);
    }
  }, [selectedProduction, setEditFormData]);

  return {
    searchQuery,
    setSearchQuery,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    selectedProduction,
    sortedProductions,
    handleCreateProduction: onCreateProduction,
    handleEditProduction: onEditProduction,
    handleDeleteProduction: onDeleteProduction,
    openEditDialog,
    openDeleteDialog,
    calculateCost,
    calculateSemiFinishedCosts,
    getRecipeName,
    getRecipeOutput,
    checkSemiFinalAvailability
  };
};
