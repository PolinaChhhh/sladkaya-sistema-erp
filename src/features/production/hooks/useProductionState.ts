import { useState } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { useProductionForm } from './useProductionForm';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionUtils } from './useProductionUtils';
import { calculateCostWithFIFO } from '../utils/fifoCalculator';
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
  
  // Cost calculation function using the FIFO utility
  const calculateCost = (recipeId: string, quantity: number): number => {
    return calculateCostWithFIFO(recipeId, quantity, recipes, ingredients, receipts);
  };
  
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
    addProduction,
    updateProduction,
    calculateCost
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
  
  // Hook for recipe utilities
  const { getRecipeName, getRecipeOutput } = useProductionUtils(recipes);
  
  // Handle delete production
  const handleDeleteProduction = () => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    
    toast.success('Запись о производстве удалена');
    setIsDeleteDialogOpen(false);
  };
  
  // Submit handlers that use the form handling functions
  const onCreateProduction = () => {
    const success = handleCreateProduction();
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };
  
  const onEditProduction = () => {
    const success = handleEditProduction(selectedProduction);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

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
    getRecipeOutput
  };
};
