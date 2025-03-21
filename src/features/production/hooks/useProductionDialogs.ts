
import { useState } from 'react';
import { ProductionBatch } from '@/store/types';
import { format } from 'date-fns';

export const useProductionDialogs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
  const openEditDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDeleteDialogOpen(true);
  };

  return {
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
  };
};
