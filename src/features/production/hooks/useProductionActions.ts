
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ProductionBatch } from '@/store/types';
import { useProductionStorage } from './useProductionStorage';

export const useProductionActions = (
  handleCreateProduction: () => boolean,
  handleEditProduction: (production: ProductionBatch | null) => boolean,
  deleteProduction: (id: string) => void,
  setIsCreateDialogOpen: (open: boolean) => void,
  setIsEditDialogOpen: (open: boolean) => void,
  setIsDeleteDialogOpen: (open: boolean) => void,
  selectedProduction: ProductionBatch | null,
  formData: any,
  editFormData: any
) => {
  const { clearFormData, clearEditFormData } = useProductionStorage();
  
  // Submit handlers that use the form handling functions
  const onCreateProduction = useCallback(() => {
    console.log("Attempting to create production with data:", formData);
    const success = handleCreateProduction();
    if (success) {
      setIsCreateDialogOpen(false);
      // Clear form data in localStorage after successful creation
      clearFormData();
    }
  }, [handleCreateProduction, setIsCreateDialogOpen, formData, clearFormData]);
  
  const onEditProduction = useCallback(() => {
    console.log("Attempting to edit production with data:", editFormData);
    const success = handleEditProduction(selectedProduction);
    if (success) {
      setIsEditDialogOpen(false);
      // Clear edit form data in localStorage after successful edit
      clearEditFormData();
    }
  }, [handleEditProduction, selectedProduction, setIsEditDialogOpen, editFormData, clearEditFormData]);
  
  // Handle delete production
  const onDeleteProduction = useCallback(() => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    
    toast.success('Запись о производстве удалена');
    setIsDeleteDialogOpen(false);
  }, [selectedProduction, deleteProduction, setIsDeleteDialogOpen]);
  
  return {
    onCreateProduction,
    onEditProduction,
    onDeleteProduction
  };
};
