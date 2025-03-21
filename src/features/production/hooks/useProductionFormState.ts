
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ProductionBatch } from '@/store/types';

export const useProductionFormState = (recipes: any[]) => {
  // Form states
  const [createFormData, setCreateFormData] = useState({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    autoProduceSemiFinals: true,
  });
  
  const [editFormData, setEditFormData] = useState({
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // Update form data when selected production changes
  const updateEditFormDataFromProduction = (selectedProduction: ProductionBatch | null) => {
    if (selectedProduction) {
      setEditFormData({
        quantity: selectedProduction.quantity,
        date: selectedProduction.date.split('T')[0], // Format date for input
      });
    }
  };
  
  // Reset form data
  const resetCreateFormData = () => {
    setCreateFormData({
      recipeId: recipes.length > 0 ? recipes[0].id : '',
      quantity: 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      autoProduceSemiFinals: true,
    });
  };

  return {
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    updateEditFormDataFromProduction,
    resetCreateFormData
  };
};
