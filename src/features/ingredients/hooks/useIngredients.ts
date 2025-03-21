
import { useState } from 'react';
import { useStore, Ingredient } from '@/store/recipeStore';
import { toast } from 'sonner';

const DEFAULT_INGREDIENT_TYPE = 'Ингредиент';

export const useIngredients = () => {
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

  return {
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
  };
};
