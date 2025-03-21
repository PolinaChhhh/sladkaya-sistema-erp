
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useStore, Recipe } from '@/store/recipeStore';
import { toast } from 'sonner';

// Import refactored components
import RecipeHeader from '@/features/recipes/RecipeHeader';
import RecipeSearch from '@/features/recipes/RecipeSearch';
import RecipesList from '@/features/recipes/RecipesList';
import RecipeForm from '@/features/recipes/RecipeForm';
import DeleteConfirmDialog from '@/features/recipes/DeleteConfirmDialog';

const Recipes = () => {
  const { recipes, ingredients, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: {
      ingredientId: string;
      amount: number;
    }[];
  }>({
    name: '',
    description: '',
    output: 1,
    outputUnit: 'кг',
    items: [],
  });
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const initCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      output: 1,
      outputUnit: 'кг',
      items: [],
    });
    setIsCreateDialogOpen(true);
  };
  
  const initEditForm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description,
      output: recipe.output,
      outputUnit: recipe.outputUnit,
      items: [...recipe.items],
    });
    setIsEditDialogOpen(true);
  };
  
  const initDeleteConfirm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleCreateRecipe = () => {
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    addRecipe({
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
      lastProduced: null,
    });
    
    toast.success('Рецепт успешно создан');
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateRecipe = () => {
    if (!selectedRecipe) return;
    
    if (formData.name.trim() === '') {
      toast.error('Введите название рецепта');
      return;
    }
    
    updateRecipe(selectedRecipe.id, {
      name: formData.name,
      description: formData.description,
      items: formData.items,
      output: formData.output,
      outputUnit: formData.outputUnit,
    });
    
    toast.success('Рецепт успешно обновлен');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteRecipe = () => {
    if (!selectedRecipe) return;
    
    deleteRecipe(selectedRecipe.id);
    toast.success('Рецепт успешно удален');
    setIsDeleteConfirmOpen(false);
  };
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <RecipeHeader onAddNew={initCreateForm} />
      
      <RecipeSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <RecipesList 
        recipes={filteredRecipes} 
        onEdit={initEditForm}
        onDelete={initDeleteConfirm}
        getIngredientName={getIngredientName}
        getIngredientUnit={getIngredientUnit}
      />
      
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
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
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
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
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
    </div>
  );
};

export default Recipes;
