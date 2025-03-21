
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Ingredient } from '@/store/recipeStore';

// Import our components
import IngredientHeader from '@/features/ingredients/IngredientHeader';
import IngredientFilter from '@/features/ingredients/IngredientFilter';
import IngredientTable from '@/features/ingredients/IngredientTable';
import IngredientForm from '@/features/ingredients/IngredientForm';
import DeleteConfirmDialog from '@/features/ingredients/DeleteConfirmDialog';
import EmptyState from '@/features/ingredients/EmptyState';
import SemiFinalIngredientTable from '@/features/ingredients/SemiFinalIngredientTable';
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
      
      {regularIngredients.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ингредиенты</h2>
          <IngredientTable 
            ingredients={regularIngredients} 
            onEdit={initEditForm} 
            onDelete={initDeleteConfirm} 
          />
        </div>
      ) : (
        searchQuery === '' && ingredientTypeFilter === 'all' ? (
          <EmptyState />
        ) : (
          <div className="glass rounded-xl p-6 text-center my-4">
            <p className="text-gray-500">Нет ингредиентов, соответствующих вашему запросу</p>
          </div>
        )
      )}
      
      {semiFinalIngredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Полуфабрикаты</h2>
          <SemiFinalIngredientTable
            ingredients={semiFinalIngredients}
            onEdit={initEditForm}
            onDelete={initDeleteConfirm}
          />
        </div>
      )}
      
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
