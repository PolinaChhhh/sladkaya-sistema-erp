
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import ProductionDialog from './ProductionDialog';
import EditProductionDialog from './EditProductionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ProductionDetailDialog from './ProductionDetailDialog';
import { ProductionBatch, Recipe } from '@/store/types';

interface ProductionDialogManagerProps {
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
  setIsDetailDialogOpen: (open: boolean) => void;
  
  // Utility functions
  calculateCost: (recipeId: string, quantity: number) => number;
  getRecipeName: (recipeId: string) => string;
  getRecipeOutput: (recipeId: string) => string;
  getIngredientDetails: (ingredientId: string) => any;
  getIngredientUsageDetails: (production: ProductionBatch) => any;
  getSemiFinalBreakdown: (production: ProductionBatch) => { recipeId: string, amount: number, cost: number }[];
  getSelectedRecipe: () => Recipe | null;
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
          calculateCost={calculateCost}
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
        getIngredientDetails={getIngredientDetails}
        getRecipeName={getRecipeName}
        getIngredientUsageDetails={getIngredientUsageDetails}
        getSemiFinalBreakdown={getSemiFinalBreakdown}
      />
    </>
  );
};

export default ProductionDialogManager;
