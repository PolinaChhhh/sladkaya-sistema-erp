
import React from 'react';
import { useStore } from '@/store/recipeStore';
import { useProductionOperations } from '@/features/production/hooks/useProductionOperations';
import ProductionList from '@/features/production/components/ProductionList';
import ProductionHeader from '@/features/production/components/ProductionHeader';
import ProductionDialog from '@/features/production/components/ProductionDialog';
import ProductionDetailDialog from '@/features/production/components/ProductionDetailDialog';
import EditProductionDialog from '@/features/production/components/EditProductionDialog';
import DeleteConfirmDialog from '@/features/production/components/DeleteConfirmDialog';
import { useState, useEffect } from 'react';
import { ProductionBatch } from '@/store/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';

const Production = () => {
  const { recipes, productions, ingredients, receipts } = useStore();
  const { addProduction, editProduction, removeProduction } = useProductionOperations();
  
  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Selected production states
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
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
  
  // Update edit form data when selected production changes
  useEffect(() => {
    if (selectedProduction) {
      setEditFormData({
        quantity: selectedProduction.quantity,
        date: selectedProduction.date.split('T')[0], // Format date for input
      });
    }
  }, [selectedProduction]);
  
  // Filter and sort productions
  const filteredProductions = productions
    .filter(p => {
      if (!searchQuery) return true;
      
      const recipe = recipes.find(r => r.id === p.recipeId);
      if (!recipe) return false;
      
      return recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get recipe name helper
  const getRecipeName = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  // Get recipe output unit helper
  const getRecipeOutput = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };
  
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
  
  // Form submission handlers
  const handleCreateProduction = () => {
    if (!createFormData.recipeId) {
      toast.error('Выберите рецепт');
      return;
    }
    
    if (createFormData.quantity <= 0) {
      toast.error('Количество должно быть больше нуля');
      return;
    }
    
    const success = addProduction(createFormData);
    
    if (success) {
      setIsCreateDialogOpen(false);
      // Reset form data
      setCreateFormData({
        recipeId: recipes.length > 0 ? recipes[0].id : '',
        quantity: 1,
        date: format(new Date(), 'yyyy-MM-dd'),
        autoProduceSemiFinals: true,
      });
    }
  };
  
  const handleEditProduction = () => {
    if (!selectedProduction) {
      toast.error('Производство не выбрано');
      return;
    }
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше нуля');
      return;
    }
    
    const success = editProduction(selectedProduction.id, editFormData);
    
    if (success) {
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteProduction = () => {
    if (!selectedProduction) {
      toast.error('Производство не выбрано');
      return;
    }
    
    const success = removeProduction(selectedProduction.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Get selected recipe
  const getSelectedRecipe = () => {
    if (!selectedProduction) return null;
    return recipes.find(r => r.id === selectedProduction.recipeId) || null;
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <ProductionHeader 
        onAddNew={openCreateDialog} 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <ProductionList 
        productions={filteredProductions}
        getRecipeName={getRecipeName}
        getRecipeOutput={getRecipeOutput}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        onViewDetails={openDetailDialog}
      />
      
      {/* Create Dialog */}
      <ProductionDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={createFormData}
        setFormData={setCreateFormData}
        onSubmit={handleCreateProduction}
        getRecipeOutput={getRecipeOutput}
      />
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditProductionDialog 
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          production={selectedProduction}
          formData={editFormData}
          setFormData={setEditFormData}
          onSubmit={handleEditProduction}
          recipeOutput={selectedProduction ? getRecipeOutput(selectedProduction.recipeId) : ''}
        />
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog 
          recipeName={selectedProduction ? getRecipeName(selectedProduction.recipeId) : ''}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProduction}
        />
      </Dialog>
      
      {/* Detail Dialog */}
      <ProductionDetailDialog 
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        production={selectedProduction}
        recipe={getSelectedRecipe()}
        receipts={receipts}
        ingredients={ingredients}
        getRecipeName={getRecipeName}
      />
    </div>
  );
};

export default Production;
