
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Recipe, Ingredient, RecipeItem, RecipeCategory } from '@/store/recipeStore';
import RecipeForm from '@/features/recipes/RecipeForm';
import DeleteConfirmDialog from '@/features/recipes/DeleteConfirmDialog';

interface RecipeDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: {
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
    category: RecipeCategory;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    lossPercentage: number;
    items: RecipeItem[];
    category: RecipeCategory;
  }>>;
  selectedRecipe: Recipe | null;
  handleCreateRecipe: () => void;
  handleUpdateRecipe: () => void;
  handleDeleteRecipe: () => void;
  ingredients: Ingredient[];
  recipes: Recipe[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeDialogs: React.FC<RecipeDialogsProps> = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  formData,
  setFormData,
  selectedRecipe,
  handleCreateRecipe,
  handleUpdateRecipe,
  handleDeleteRecipe,
  ingredients,
  recipes,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  return (
    <>
      {/* Create Recipe Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <RecipeForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          title="Создать новый рецепт"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateRecipe}
          ingredients={ingredients}
          recipes={recipes}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
        />
      </Dialog>
      
      {/* Edit Recipe Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <RecipeForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Редактировать рецепт"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdateRecipe}
          ingredients={ingredients}
          recipes={recipes}
          currentRecipeId={selectedRecipe?.id}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
        />
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DeleteConfirmDialog
          name={selectedRecipe?.name || ''}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDeleteRecipe}
        />
      </Dialog>
    </>
  );
};

export default RecipeDialogs;
