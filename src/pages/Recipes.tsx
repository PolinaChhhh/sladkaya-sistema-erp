
import React from 'react';
import { useStore } from '@/store/recipeStore';

// Import refactored components
import RecipeHeader from '@/features/recipes/RecipeHeader';
import RecipeSearch from '@/features/recipes/RecipeSearch';
import RecipeDialogs from '@/features/recipes/RecipeDialogs';
import RecipeContentTabs from '@/features/recipes/RecipeContentTabs';

// Import custom hooks
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { useRecipeDelete } from '@/features/recipes/hooks/useRecipeDelete';
import { useRecipeFilters } from '@/features/recipes/hooks/useRecipeFilters';
import { useRecipeUtils } from '@/features/recipes/hooks/useRecipeUtils';

const Recipes = () => {
  const { recipes, ingredients, productions, shippings, addRecipe, updateRecipe, deleteRecipe } = useStore();
  
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
  
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    selectedTags,
    allTags,
    handleTagToggle,
    filteredRecipes
  } = useRecipeFilters(recipes);
  
  const {
    getIngredientName,
    getIngredientUnit,
    getRecipeName,
    getRecipeUnit
  } = useRecipeUtils(recipes, ingredients);

  // Use the current selected recipe (either from form or delete context)
  const selectedRecipe = formSelectedRecipe || deleteSelectedRecipe;

  return (
    <div className="max-w-5xl mx-auto">
      <RecipeHeader onAddNew={initCreateForm} />
      
      <RecipeSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <RecipeContentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        filteredRecipes={filteredRecipes}
        recipes={recipes}
        productions={productions}
        shippings={shippings} // Added shippings prop
        onEdit={initEditForm}
        onDelete={initDeleteConfirm}
        getIngredientName={getIngredientName}
        getIngredientUnit={getIngredientUnit}
        getRecipeName={getRecipeName}
        getRecipeUnit={getRecipeUnit}
      />
      
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
