
import React from 'react';
import { ProductionBatch } from '@/store/types';
import ProductionDialog from './ProductionDialog';
import EditProductionDialog from './EditProductionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ProductionDetailDialog from './ProductionDetailDialog';

interface ProductionDialogManagerProps {
  // Create dialog props
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  createFormData: any;
  setCreateFormData: (data: any) => void;
  handleCreateProduction: () => void;
  
  // Edit dialog props
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  selectedProduction: ProductionBatch | null;
  editFormData: any;
  setEditFormData: (data: any) => void;
  handleEditProduction: () => void;
  
  // Delete dialog props
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handleDeleteProduction: () => void;
  
  // Detail dialog props
  isDetailDialogOpen: boolean;
  setIsDetailDialogOpen: (isOpen: boolean) => void;
  
  // Utility functions
  calculateCost: (recipeId: string, quantity: number) => number;
  getIngredientCostBreakdown?: (recipeId: string, quantity: number) => any[];
  getRecipeName: (recipeId: string) => string;
  getRecipeOutput: (recipeId: string) => string;
  getIngredientDetails: (ingredientId: string) => any;
  getIngredientUsageDetails: (production: ProductionBatch) => any[];
  getSemiFinalBreakdown: (production: ProductionBatch) => any[];
  getSelectedRecipe: () => any;
}

const ProductionDialogManager: React.FC<ProductionDialogManagerProps> = ({
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
  setIsDetailDialogOpen,
  
  // Utility functions
  calculateCost,
  getIngredientCostBreakdown,
  getRecipeName,
  getRecipeOutput,
  getIngredientDetails,
  getIngredientUsageDetails,
  getSemiFinalBreakdown,
  getSelectedRecipe
}) => {
  return (
    <>
      {/* Create Dialog */}
      <ProductionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        formData={createFormData}
        setFormData={setCreateFormData}
        onSubmit={handleCreateProduction}
        calculateCost={calculateCost}
        getRecipeOutput={getRecipeOutput}
        getIngredientCostBreakdown={getIngredientCostBreakdown}
      />
      
      {/* Edit Dialog */}
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
      
      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        recipeName={selectedProduction ? getRecipeName(selectedProduction.recipeId) : ''}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduction}
      />
      
      {/* Production Detail Dialog */}
      <ProductionDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        production={selectedProduction}
        recipe={getSelectedRecipe()}
        getIngredientDetails={getIngredientDetails}
        getRecipeName={getRecipeName}
        getIngredientUsageDetails={getIngredientUsageDetails}
        getSemiFinalBreakdown={getSemiFinalBreakdown}
      />
    </>
  );
};

export default ProductionDialogManager;
