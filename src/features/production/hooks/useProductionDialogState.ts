
import { useCallback } from 'react';
import { ProductionBatch } from '@/store/types';
import { useProductionDialogs } from './useProductionDialogs';
import { useProductionActions } from './useProductionActions';

export const useProductionDialogState = (
  handleCreateProduction: () => boolean,
  handleEditProduction: (production: ProductionBatch | null) => boolean,
  deleteProduction: (id: string) => void,
  formData: any,
  editFormData: any
) => {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduction,
    setSelectedProduction,
    openEditDialog,
    openDeleteDialog
  } = useProductionDialogs();
  
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
  
  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduction,
    openEditDialog,
    openDeleteDialog,
    handleCreateProduction: onCreateProduction,
    handleEditProduction: onEditProduction,
    handleDeleteProduction: onDeleteProduction
  };
};
