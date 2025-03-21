
import React, { useEffect } from 'react';
import ProductionHeader from './components/ProductionHeader';
import ProductionDialogs from './components/ProductionDialogs';
import ProductionListSection from './components/ProductionListSection';
import { useStore } from '@/store/recipeStore';
import { useProductionState } from './hooks/useProductionState';
import { useProductionDetailsDialog } from './hooks/useProductionDetailsDialog';

const ProductionPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortedProductions,
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
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    openEditDialog,
    openDeleteDialog,
    calculateCost,
    getRecipeName,
    getRecipeOutput,
    checkSemiFinalAvailability
  } = useProductionState();

  const {
    isDetailDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    selectedProduction: detailProduction,
    selectedRecipe,
    getIngredientDetails,
    getIngredientUsageDetails,
    getSemiFinalBreakdown
  } = useProductionDetailsDialog();

  console.log("Create dialog open:", isCreateDialogOpen);
  console.log("Form data:", formData);

  return (
    <div className="max-w-5xl mx-auto">
      <ProductionHeader onAddNew={() => setIsCreateDialogOpen(true)} />
      
      <ProductionListSection 
        productions={sortedProductions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
        createFormData={formData}
        setCreateFormData={setFormData}
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
        closeDetailDialog={closeDetailDialog}
        detailProduction={detailProduction}
        selectedRecipe={selectedRecipe}
        
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

export default ProductionPage;
