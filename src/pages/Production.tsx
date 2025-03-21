
import React from 'react';
import { useProductionPage } from '@/features/production/hooks/useProductionPage';
import ProductionList from '@/features/production/components/ProductionList';
import ProductionHeader from '@/features/production/components/ProductionHeader';
import ProductionDialogs from '@/features/production/components/ProductionDialogs';

const Production = () => {
  // The hook is now much cleaner with all the functionality divided into submodules
  const {
    // Search and filtering
    searchQuery,
    setSearchQuery,
    filteredProductions,
    
    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    
    // Current selection and form data
    selectedProduction,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    
    // Actions
    openCreateDialog,
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    
    // Utility functions
    getRecipeName,
    getRecipeOutput,
    getIngredientDetails,
    getIngredientUsageDetails,
    getSemiFinalBreakdown,
    getSelectedRecipe,
    
    // Dialog openers
    openEditDialog,
    openDeleteDialog,
    openDetailDialog
  } = useProductionPage();
  
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
      
      <ProductionDialogs 
        // Create dialog props
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        createFormData={createFormData}
        setCreateFormData={setCreateFormData}
        handleCreateProduction={handleCreateProduction}
        
        // Edit dialog props
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedProduction={selectedProduction}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleEditProduction={handleEditProduction}
        
        // Delete dialog props
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteProduction={handleDeleteProduction}
        
        // Detail dialog props
        isDetailDialogOpen={isDetailDialogOpen}
        closeDetailDialog={() => setIsDetailDialogOpen(false)}
        detailProduction={selectedProduction}
        selectedRecipe={getSelectedRecipe()}
        
        // Utility functions
        getRecipeName={getRecipeName}
        getRecipeOutput={getRecipeOutput}
        getIngredientDetails={getIngredientDetails}
        getIngredientUsageDetails={getIngredientUsageDetails}
        getSemiFinalBreakdown={getSemiFinalBreakdown}
      />
    </div>
  );
};

export default Production;
