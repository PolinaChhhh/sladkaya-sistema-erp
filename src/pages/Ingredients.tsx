
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useStore, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';

// Import our new components
import IngredientHeader from '@/features/ingredients/IngredientHeader';
import IngredientFilter from '@/features/ingredients/IngredientFilter';
import IngredientTable from '@/features/ingredients/IngredientTable';
import IngredientForm from '@/features/ingredients/IngredientForm';
import DeleteConfirmDialog from '@/features/ingredients/DeleteConfirmDialog';
import EmptyState from '@/features/ingredients/EmptyState';

const Ingredients = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ingredient' | 'semifinal'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    unit: string;
    cost: number;
    quantity: number;
    isSemiFinal: boolean;
  }>({
    name: '',
    unit: 'кг',
    cost: 0,
    quantity: 0,
    isSemiFinal: false,
  });
  
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') {
      return matchesSearch;
    } else if (filterType === 'ingredient') {
      return matchesSearch && !ingredient.isSemiFinal;
    } else {
      return matchesSearch && ingredient.isSemiFinal;
    }
  });
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      unit: 'кг',
      cost: 0,
      quantity: 0,
      isSemiFinal: false,
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      cost: ingredient.cost,
      quantity: ingredient.quantity,
      isSemiFinal: ingredient.isSemiFinal,
    });
    setIsEditDialogOpen(true);
  };
  
  const initDeleteConfirm = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleCreateIngredient = () => {
    if (formData.name.trim() === '') {
      toast.error('Введите название ингредиента');
      return;
    }
    
    addIngredient({
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      lastPurchaseDate: new Date().toISOString(),
      isSemiFinal: formData.isSemiFinal,
    });
    
    toast.success('Ингредиент успешно создан');
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateIngredient = () => {
    if (!selectedIngredient) return;
    
    if (formData.name.trim() === '') {
      toast.error('Введите название ингредиента');
      return;
    }
    
    updateIngredient(selectedIngredient.id, {
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      isSemiFinal: formData.isSemiFinal,
    });
    
    toast.success('Ингредиент успешно обновлен');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteIngredient = () => {
    if (!selectedIngredient) return;
    
    deleteIngredient(selectedIngredient.id);
    toast.success('Ингредиент успешно удален');
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <IngredientHeader onAddNew={initCreateForm} />
      <IngredientFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      
      {filteredIngredients.length > 0 ? (
        <IngredientTable 
          ingredients={filteredIngredients} 
          onEdit={initEditForm} 
          onDelete={initDeleteConfirm} 
        />
      ) : (
        <EmptyState />
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
