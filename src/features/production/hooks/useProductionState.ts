
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { useProductionForm } from './useProductionForm';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionUtils } from './useProductionUtils';
import { calculateTotalProductionCost } from '../utils/productionCalculator';
import { toast } from 'sonner';

// Ключи для localStorage
const SEARCH_QUERY_KEY = 'production_search_query';
const FORM_DATA_KEY = 'production_form_data';
const EDIT_FORM_DATA_KEY = 'production_edit_form_data';

export const useProductionState = () => {
  const { recipes, ingredients, productions, addProduction, updateProduction, deleteProduction, receipts } = useStore();
  
  // Загружаем сохраненные данные из localStorage
  const getInitialSearchQuery = () => {
    try {
      const saved = localStorage.getItem(SEARCH_QUERY_KEY);
      return saved || '';
    } catch (e) {
      return '';
    }
  };
  
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  
  // Persist search query to localStorage
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    try {
      localStorage.setItem(SEARCH_QUERY_KEY, query);
    } catch (e) {
      console.error('Failed to save search query to localStorage', e);
    }
  }, []);
  
  // Filter and sort productions - useMemo для оптимизации
  const filteredProductions = useMemo(() => {
    return productions.filter(production => {
      const recipe = recipes.find(r => r.id === production.recipeId);
      return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [productions, recipes, searchQuery]);
  
  // Sort productions by date (newest first)
  const sortedProductions = useMemo(() => {
    return [...filteredProductions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredProductions]);
  
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
  
  // Загружаем начальные данные формы из localStorage
  const getInitialFormData = () => {
    try {
      const saved = localStorage.getItem(FORM_DATA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load form data from localStorage', e);
    }
    return null; // Если ничего не найдено, вернем null и будут использованы дефолтные значения
  };
  
  const getInitialEditFormData = () => {
    try {
      const saved = localStorage.getItem(EDIT_FORM_DATA_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load edit form data from localStorage', e);
    }
    return null;
  };
  
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
  
  // Оборачиваем setFormData чтобы сохранять в localStorage
  const setFormData = useCallback((data: any) => {
    originalSetFormData(data);
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save form data to localStorage', e);
    }
  }, [originalSetFormData]);
  
  // Оборачиваем setEditFormData чтобы сохранять в localStorage
  const setEditFormData = useCallback((data: any) => {
    originalSetEditFormData(data);
    try {
      localStorage.setItem(EDIT_FORM_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save edit form data to localStorage', e);
    }
  }, [originalSetEditFormData]);
  
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
    console.log("Attempting to create production with data:", formData);
    const success = handleCreateProduction();
    if (success) {
      setIsCreateDialogOpen(false);
      // Clear form data in localStorage after successful creation
      localStorage.removeItem(FORM_DATA_KEY);
    }
  }, [handleCreateProduction, setIsCreateDialogOpen, formData]);
  
  const onEditProduction = useCallback(() => {
    console.log("Attempting to edit production with data:", editFormData);
    const success = handleEditProduction(selectedProduction);
    if (success) {
      setIsEditDialogOpen(false);
      // Clear edit form data in localStorage after successful edit
      localStorage.removeItem(EDIT_FORM_DATA_KEY);
    }
  }, [handleEditProduction, selectedProduction, setIsEditDialogOpen, editFormData]);

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
    setSearchQuery: updateSearchQuery,
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
