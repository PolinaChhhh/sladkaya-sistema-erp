
import React from 'react';
import { Dialog } from '@/components/ui/dialog';

// Import our components
import IngredientHeader from '@/features/ingredients/IngredientHeader';
import IngredientFilter from '@/features/ingredients/IngredientFilter';
import IngredientForm from '@/features/ingredients/IngredientForm';
import DeleteConfirmDialog from '@/features/ingredients/DeleteConfirmDialog';
import IngredientsContent from '@/features/ingredients/IngredientsContent';
import { useIngredients } from '@/features/ingredients/hooks/useIngredients';

const Ingredients = () => {
  const {
    regularIngredients,
    semiFinalIngredients,
    searchQuery,
    setSearchQuery,
    ingredientTypeFilter,
    setIngredientTypeFilter,
    allIngredientTypes,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedIngredient,
    formData,
    setFormData,
    initCreateForm,
    initEditForm,
    initDeleteConfirm,
    handleCreateIngredient,
    handleUpdateIngredient,
    handleDeleteIngredient,
  } = useIngredients();

  return (
    <div className="max-w-5xl mx-auto">
      <IngredientHeader onAddNew={initCreateForm} />
      <IngredientFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        ingredientTypeFilter={ingredientTypeFilter}
        setIngredientTypeFilter={setIngredientTypeFilter}
        ingredientTypes={allIngredientTypes}
      />
      
      <IngredientsContent
        regularIngredients={regularIngredients}
        semiFinalIngredients={semiFinalIngredients}
        searchQuery={searchQuery}
        ingredientTypeFilter={ingredientTypeFilter}
        onEdit={initEditForm}
        onDelete={initDeleteConfirm}
      />
      
      {/* Create Ingredient Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <IngredientForm
          title="Добавить ингредиент"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateIngredient}
          submitLabel="Добавить"
          ingredientTypes={allIngredientTypes}
        />
      </Dialog>
      
      {/* Edit Ingredient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <IngredientForm
          title="Редактировать ингредиент"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => setIsEditDialogOpen(false)}
          onSubmit={handleUpdateIngredient}
          submitLabel="Сохранить изменения"
          ingredientTypes={allIngredientTypes}
        />
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DeleteConfirmDialog
          name={selectedIngredient?.name || ''}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDeleteIngredient}
        />
      </Dialog>
    </div>
  );
};

export default Ingredients;
