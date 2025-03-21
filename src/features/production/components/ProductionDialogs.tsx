
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ProductionBatch, Recipe } from '@/store/recipeStore';
import { useStore } from '@/store/recipeStore';
import ProductionForm from './ProductionForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ProductionDetails from './ProductionDetails';
import { ProductionFormData } from '../hooks/useProductionPage';

interface ProductionDialogsProps {
  // Create dialog props
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  createFormData: ProductionFormData;
  setCreateFormData: (data: ProductionFormData) => void;
  handleCreateProduction: () => void;
  
  // Edit dialog props
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedProduction: ProductionBatch | null;
  editFormData: ProductionFormData;
  setEditFormData: (data: ProductionFormData) => void;
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
  calculateCost: (recipe: Recipe, quantity: number) => number;
  getRecipeName: (id: string) => string;
  getRecipeOutput: (id: string) => string;
  getIngredientDetails: (recipes: Recipe[], recipeId: string, quantity: number) => any[];
  getIngredientUsageDetails: (recipeId: string, quantity: number) => any[];
  getSemiFinalBreakdown: (recipeId: string, quantity: number) => any[];
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
  getIngredientUsageDetails,
  getSemiFinalBreakdown
}) => {
  const { recipes } = useStore();
  
  return (
    <>
      {/* Create Production Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ProductionForm
          title="Добавить производство"
          recipes={recipes}
          formData={createFormData}
          onFormDataChange={(data) => setCreateFormData({ ...createFormData, ...data })}
          onSubmit={handleCreateProduction}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </Dialog>
      
      {/* Edit Production Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ProductionForm
          title="Редактировать производство"
          recipes={recipes}
          formData={editFormData}
          onFormDataChange={(data) => setEditFormData({ ...editFormData, ...data })}
          onSubmit={handleEditProduction}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduction}
        title="Удалить производство"
        message="Вы уверены, что хотите удалить это производство? Эта операция восстановит все ингредиенты в соответствии с методом FIFO и не может быть отменена."
      />
      
      {/* Production Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={closeDetailDialog}>
        {detailProduction && (
          <ProductionDetails
            production={detailProduction}
            recipe={selectedRecipe}
            getRecipeName={getRecipeName}
            getRecipeOutput={getRecipeOutput}
            getIngredientDetails={getIngredientDetails}
            getIngredientUsageDetails={getIngredientUsageDetails}
            getSemiFinalBreakdown={getSemiFinalBreakdown}
            onClose={closeDetailDialog}
          />
        )}
      </Dialog>
    </>
  );
};

export default ProductionDialogs;
