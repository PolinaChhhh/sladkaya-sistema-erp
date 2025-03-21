
import React from 'react';
import { useProductionPage } from '@/features/production/hooks/useProductionPage';
import ProductionList from '@/features/production/components/ProductionList';
import ProductionHeader from '@/features/production/components/ProductionHeader';
import ProductionDialogs from '@/features/production/components/ProductionDialogs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const Production = () => {
  const {
    // Loading and error states
    isLoading,
    error,
    
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
    calculateTotalCost,
    getSelectedRecipe,
    
    // Dialog openers
    openEditDialog,
    openDeleteDialog,
    openDetailDialog
  } = useProductionPage();
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-sm mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        
        <div className="glass rounded-xl overflow-hidden p-4">
          <Skeleton className="h-10 w-full mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg flex items-center">
          <AlertCircle className="h-6 w-6 mr-3" />
          <div>
            <h3 className="font-medium text-lg">Ошибка загрузки данных</h3>
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных о производстве'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render main content when data is available
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
        calculateTotalCost={calculateTotalCost}
      />
    </div>
  );
};

export default Production;
