
import React, { useState } from 'react';
import { useStore } from '@/store/recipeStore';

// Import refactored components
import RecipeHeader from '@/features/recipes/RecipeHeader';
import RecipeSearch from '@/features/recipes/RecipeSearch';
import RecipesList from '@/features/recipes/RecipesList';
import RecipeDialogs from '@/features/recipes/RecipeDialogs';

// Import custom hooks
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { useRecipeDelete } from '@/features/recipes/hooks/useRecipeDelete';

const Recipes = () => {
  const { recipes, ingredients, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use custom hooks
  const { 
    formData, 
    setFormData,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedRecipe: formSelectedRecipe,
    initCreateForm,
    initEditForm,
    handleCreateRecipe,
    handleUpdateRecipe
  } = useRecipeForm({ addRecipe, updateRecipe });
  
  const {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedRecipe: deleteSelectedRecipe,
    initDeleteConfirm,
    handleDeleteRecipe
  } = useRecipeDelete({ deleteRecipe });
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Неизвестный ингредиент';
  };
  
  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.unit : '';
  };

  const getRecipeName = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeUnit = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    return recipe ? recipe.outputUnit : '';
  };

  // Use the current selected recipe (either from form or delete context)
  const selectedRecipe = formSelectedRecipe || deleteSelectedRecipe;

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
        getRecipeName={getRecipeName}
        getRecipeUnit={getRecipeUnit}
      />
      
      {/* Use the RecipeDialogs component */}
      <RecipeDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        formData={formData}
        setFormData={setFormData}
        selectedRecipe={selectedRecipe}
        handleCreateRecipe={handleCreateRecipe}
        handleUpdateRecipe={handleUpdateRecipe}
        handleDeleteRecipe={handleDeleteRecipe}
        ingredients={ingredients}
        recipes={recipes}
        getIngredientName={getIngredientName}
        getIngredientUnit={getIngredientUnit}
        getRecipeName={getRecipeName}
        getRecipeUnit={getRecipeUnit}
      />
    </div>
  );
};

export default Recipes;
