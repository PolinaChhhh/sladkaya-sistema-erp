
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useStore, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Import our new components
import IngredientHeader from '@/features/ingredients/IngredientHeader';
import IngredientFilter from '@/features/ingredients/IngredientFilter';
import IngredientTable from '@/features/ingredients/IngredientTable';
import IngredientForm from '@/features/ingredients/IngredientForm';
import DeleteConfirmDialog from '@/features/ingredients/DeleteConfirmDialog';
import EmptyState from '@/features/ingredients/EmptyState';

const DEFAULT_INGREDIENT_TYPE = 'Ингредиент';

const Ingredients = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [ingredientTypeFilter, setIngredientTypeFilter] = useState<string>('all');
  
  // Get unique ingredient types from existing ingredients
  const existingTypes = [...new Set(ingredients.map(ing => ing.type).filter(Boolean))];
  const allIngredientTypes = [DEFAULT_INGREDIENT_TYPE, ...existingTypes.filter(type => type !== DEFAULT_INGREDIENT_TYPE)];
  
  const [formData, setFormData] = useState<{
    name: string;
    unit: string;
    cost: number;
    quantity: number;
    isSemiFinal: boolean;
    type: string;
    customType: string;
  }>({
    name: '',
    unit: 'кг',
    cost: 0,
    quantity: 0,
    isSemiFinal: false,
    type: DEFAULT_INGREDIENT_TYPE,
    customType: '',
  });
  
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = ingredientTypeFilter === 'all' ? true : ingredient.type === ingredientTypeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Separate regular ingredients from semi-finished products
  const regularIngredients = filteredIngredients.filter(ing => !ing.isSemiFinal);
  const semiFinalIngredients = filteredIngredients.filter(ing => ing.isSemiFinal);
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      unit: 'кг',
      cost: 0,
      quantity: 0,
      isSemiFinal: false,
      type: DEFAULT_INGREDIENT_TYPE,
      customType: '',
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
      type: ingredient.type || DEFAULT_INGREDIENT_TYPE,
      customType: '',
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
    
    // Determine the type - use custom type if selected
    const ingredientType = formData.type === 'custom' && formData.customType.trim() 
      ? formData.customType.trim() 
      : formData.type;
    
    addIngredient({
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      lastPurchaseDate: new Date().toISOString(),
      isSemiFinal: formData.isSemiFinal,
      type: ingredientType,
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
    
    // Determine the type - use custom type if selected
    const ingredientType = formData.type === 'custom' && formData.customType.trim() 
      ? formData.customType.trim() 
      : formData.type;
    
    updateIngredient(selectedIngredient.id, {
      name: formData.name,
      unit: formData.unit,
      cost: formData.cost,
      quantity: formData.quantity,
      isSemiFinal: formData.isSemiFinal,
      type: ingredientType,
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
          <div className="glass rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semiFinalIngredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>
                      <span className={
                        ingredient.quantity <= 0 
                          ? "text-red-500 font-medium" 
                          : ingredient.quantity < 5 
                            ? "text-orange-500 font-medium"
                            : ""
                      }>
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => initEditForm(ingredient)}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => initDeleteConfirm(ingredient)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
