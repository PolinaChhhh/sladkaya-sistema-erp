
import React from 'react';
import { useProductionPage } from '@/features/production/hooks/useProductionPage';
import ProductionList from '@/features/production/components/ProductionList';
import ProductionHeader from '@/features/production/components/ProductionHeader';
import ProductionDialogs from '@/features/production/components/ProductionDialogs';

const Production = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredProductions,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedProduction,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    openCreateDialog,
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    getRecipeName,
    getRecipeOutput,
    calculateCost,
    getIngredientDetails,
    getIngredientUsageDetails,
    getSemiFinalBreakdown,
    getSelectedRecipe,
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
        calculateCost={calculateCost}
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
