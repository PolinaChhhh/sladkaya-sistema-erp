
import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { useProductionForm } from './useProductionForm';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionUtils } from './useProductionUtils';
import { calculateTotalProductionCost } from '../utils/productionCalculator';
import { toast } from 'sonner';

export const useProductionState = () => {
  const { recipes, ingredients, productions, addProduction, updateProduction, deleteProduction, receipts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort productions
  const filteredProductions = productions.filter(production => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort productions by date (newest first)
  const sortedProductions = [...filteredProductions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Cost calculation function using both FIFO utility and semi-finished products cost
  const calculateCost = useCallback((recipeId: string, quantity: number): number => {
    return calculateTotalProductionCost(
      recipeId, 
      quantity, 
      recipes, 
      ingredients, 
      receipts, 
      productions
    );
  }, [recipes, ingredients, receipts, productions]);
  
  // Hook for recipe utilities
  const { 
    getRecipeName, 
    getRecipeOutput, 
    checkSemiFinalAvailability 
  } = useProductionUtils(recipes, productions);
  
  // Hook for form state and handling
  const { 
    formData, 
    setFormData, 
    editFormData, 
    setEditFormData, 
    handleCreateProduction, 
    handleEditProduction 
  } = useProductionForm({
    recipes,
    ingredients,
    productions,
    addProduction,
    updateProduction,
    calculateCost,
    checkSemiFinalAvailability
  });
  
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
  
  // Handle delete production
  const handleDeleteProduction = useCallback(() => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    
    toast.success('Запись о производстве удалена');
    setIsDeleteDialogOpen(false);
  }, [selectedProduction, deleteProduction, setIsDeleteDialogOpen]);
  
  // Submit handlers that use the form handling functions
  const onCreateProduction = useCallback(() => {
    const success = handleCreateProduction();
    if (success) {
      setIsCreateDialogOpen(false);
    }
  }, [handleCreateProduction, setIsCreateDialogOpen]);
  
  const onEditProduction = useCallback(() => {
    const success = handleEditProduction(selectedProduction);
    if (success) {
      setIsEditDialogOpen(false);
    }
  }, [handleEditProduction, selectedProduction, setIsEditDialogOpen]);

  // Persistence effect for edit form data when selectedProduction changes
  useEffect(() => {
    if (selectedProduction) {
      setEditFormData({
        quantity: selectedProduction.quantity,
        date: selectedProduction.date.split('T')[0], // Format date for input
      });
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
    handleDeleteProduction,
    openEditDialog,
    openDeleteDialog,
    calculateCost,
    getRecipeName,
    getRecipeOutput,
    checkSemiFinalAvailability
  };
};
