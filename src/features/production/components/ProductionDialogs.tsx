
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import ProductionDialog from './ProductionDialog';
import EditProductionDialog from './EditProductionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ProductionDetailDialog from './ProductionDetailDialog';
import { ProductionBatch, Recipe } from '@/store/types';

interface ProductionDialogsProps {
  // Create dialog props
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  createFormData: {
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  };
  setCreateFormData: React.Dispatch<React.SetStateAction<{
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }>>;
  handleCreateProduction: () => void;
  
  // Edit dialog props
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedProduction: ProductionBatch | null;
  editFormData: {
    quantity: number;
    date: string;
  };
  setEditFormData: React.Dispatch<React.SetStateAction<{
    quantity: number;
    date: string;
  }>>;
  handleEditProduction: () => void;
  
  // Delete dialog props
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteProduction: () => void;
  
  // Detail dialog props
  isDetailDialogOpen: boolean;
  closeDetailDialog: () => void;
  detailProduction: ProductionBatch | null;
  selectedRecipe: Recipe | null;
  
  // Utility functions
  calculateCost: (recipeId: string, quantity: number) => number;
  getRecipeName: (recipeId: string) => string;
  getRecipeOutput: (recipeId: string) => string;
  getIngredientDetails: (ingredientId: string) => any;
  getIngredientUsageDetails: (production: ProductionBatch) => any;
}

const ProductionDialogs: React.FC<ProductionDialogsProps> = ({
  // Create dialog props
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  createFormData,
  setCreateFormData,
  handleCreateProduction,
  
  // Edit dialog props
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedProduction,
  editFormData,
  setEditFormData,
  handleEditProduction,
  
  // Delete dialog props
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteProduction,
  
  // Detail dialog props
  isDetailDialogOpen,
  closeDetailDialog,
  detailProduction,
  selectedRecipe,
  
  // Utility functions
  calculateCost,
  getRecipeName,
  getRecipeOutput,
  getIngredientDetails,
  getIngredientUsageDetails
}) => {
  return (
    <>
      <ProductionDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={createFormData}
        setFormData={setCreateFormData}
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
    </>
  );
};

export default ProductionDialogs;
