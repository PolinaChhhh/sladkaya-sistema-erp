
import { useState } from 'react';
import { ProductionBatch } from '@/store/types';

export const useProductionDialogState = () => {
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Selected production state
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
  // Dialog handlers
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  
  const openEditDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDeleteDialogOpen(true);
  };
  
  const openDetailDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDetailDialogOpen(true);
  };

  return {
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
    openDetailDialog
  };
};
