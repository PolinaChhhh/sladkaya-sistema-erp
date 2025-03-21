
import React from 'react';
import { TrendingUp } from 'lucide-react';
import ProductionHeader from './components/ProductionHeader';
import ProductionList from './components/ProductionList';
import ProductionDialog from './components/ProductionDialog';
import EditProductionDialog from './components/EditProductionDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ProductionDetailDialog from './components/ProductionDetailDialog';
import SearchBar from './components/SearchBar';
import { useProductionState } from './hooks/useProductionState';
import { useProductionDetails } from './hooks/useProductionDetails';
import EmptyState from './components/EmptyState';
import { Dialog } from '@/components/ui/dialog';

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
    getIngredientUsageDetails
  } = useProductionDetails();

  console.log("Create dialog open:", isCreateDialogOpen);
  console.log("Form data:", formData);

  return (
    <div className="max-w-5xl mx-auto">
      <ProductionHeader onAddNew={() => setIsCreateDialogOpen(true)} />
      
      <div className="mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по рецептам..."
        />
      </div>
      
      {sortedProductions.length > 0 ? (
        <ProductionList 
          productions={sortedProductions}
          getRecipeName={getRecipeName}
          getRecipeOutput={getRecipeOutput}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onViewDetails={openDetailDialog}
        />
      ) : (
        <EmptyState icon={TrendingUp} />
      )}
      
      <ProductionDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateProduction}
        calculateCost={calculateCost}
        getRecipeOutput={getRecipeOutput}
      />
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditProductionDialog 
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          production={selectedProduction}
          formData={editFormData}
          setFormData={setEditFormData}
          onSubmit={handleEditProduction}
          recipeOutput={selectedProduction ? getRecipeOutput(selectedProduction.recipeId) : ''}
          calculateCost={calculateCost}
        />
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmDialog 
          recipeName={selectedProduction ? getRecipeName(selectedProduction.recipeId) : ''}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProduction}
        />
      </Dialog>
      
      <ProductionDetailDialog 
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
        production={detailProduction}
        recipe={selectedRecipe}
        getIngredientDetails={getIngredientDetails}
        getRecipeName={getRecipeName}
        getIngredientUsageDetails={getIngredientUsageDetails}
      />
    </div>
  );
};

export default ProductionPage;
