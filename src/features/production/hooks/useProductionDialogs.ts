
import { useState } from 'react';
import { ProductionBatch } from '@/store/types';
import { useStore } from '@/store/recipeStore';
import { toast } from 'sonner';
import { ProductionFormData } from './useProductionForm';

export const useProductionDialogs = () => {
  const { deleteProduction } = useStore();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
  // Dialog actions
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  
  const openEditDialog = (production: ProductionBatch, setEditFormData: (data: ProductionFormData) => void) => {
    setSelectedProduction(production);
    
    setEditFormData({
      recipeId: production.recipeId,
      quantity: production.quantity,
      date: new Date(production.date).toISOString().split('T')[0],
      autoProduceSemiFinals: production.autoProduceSemiFinals || false
    });
    
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
  
  const handleDeleteProduction = () => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    toast.success('Производство успешно удалено');
    setIsDeleteDialogOpen(false);
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
    openDetailDialog,
    handleDeleteProduction
  };
};
