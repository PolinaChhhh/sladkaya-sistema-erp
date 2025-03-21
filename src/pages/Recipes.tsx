
import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/recipeStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Import refactored components
import RecipeHeader from '@/features/recipes/RecipeHeader';
import RecipeSearch from '@/features/recipes/RecipeSearch';
import RecipesList from '@/features/recipes/RecipesList';
import RecipeDialogs from '@/features/recipes/RecipeDialogs';
import InStockRecipes from '@/features/recipes/InStockRecipes';
import RecipeTagFilter from '@/features/recipes/RecipeTagFilter';

// Import custom hooks
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { useRecipeDelete } from '@/features/recipes/hooks/useRecipeDelete';
import { RecipeTag } from '@/store/types';

const Recipes = () => {
  const { recipes, ingredients, productions, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'semi-finished', 'finished'
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
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
  
  // Collect all unique tags from recipes
  const allTags = useMemo(() => {
    const tagMap = new Map<string, RecipeTag>();
    
    recipes.forEach(recipe => {
      if (recipe.tags) {
        recipe.tags.forEach(tag => {
          if (!tagMap.has(tag.id)) {
            tagMap.set(tag.id, tag);
          }
        });
      }
    });
    
    return Array.from(tagMap.values());
  }, [recipes]);

  // Handle tag filtering
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  // Filter recipes by search query, category, and tags
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
    
    // Tag filtering
    const matchesTags = selectedTags.length === 0 || 
      (recipe.tags && selectedTags.every(tagId => 
        recipe.tags.some(tag => tag.id === tagId)
      ));
    
    return matchesSearch && matchesCategory && matchesTags;
  });
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Все рецепты</TabsTrigger>
          <TabsTrigger value="in-stock">На складе</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Все категории</TabsTrigger>
              <TabsTrigger value="semi-finished">Полуфабрикаты</TabsTrigger>
              <TabsTrigger value="finished">Готовые продукты</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {allTags.length > 0 && (
            <RecipeTagFilter 
              allTags={allTags} 
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          )}
          
          <RecipesList 
            recipes={filteredRecipes} 
            onEdit={initEditForm}
            onDelete={initDeleteConfirm}
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
            getRecipeName={getRecipeName}
            getRecipeUnit={getRecipeUnit}
          />
        </TabsContent>
        
        <TabsContent value="in-stock">
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Все категории</TabsTrigger>
              <TabsTrigger value="semi-finished">Полуфабрикаты</TabsTrigger>
              <TabsTrigger value="finished">Готовые продукты</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {allTags.length > 0 && (
            <RecipeTagFilter 
              allTags={allTags} 
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          )}
          
          <InStockRecipes 
            recipes={recipes.filter(r => {
              const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
              const matchesTags = selectedTags.length === 0 || 
                (r.tags && selectedTags.every(tagId => 
                  r.tags.some(tag => tag.id === tagId)
                ));
              return matchesCategory && matchesTags;
            })}
            productions={productions}
            getRecipeUnit={getRecipeUnit}
          />
        </TabsContent>
      </Tabs>
      
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
