
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecipeCategoryFilter from './RecipeCategoryFilter';
import RecipeTagFilter from './RecipeTagFilter';
import RecipesList from './RecipesList';
import InStockRecipes from './InStockRecipes';
import ChefCardDialog from './ChefCardDialog';
import { useChefCardDialog } from './hooks/useChefCardDialog';
import { Recipe, ProductionBatch, RecipeTag, ShippingDocument } from '@/store/types';

interface RecipeContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  allTags: RecipeTag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  filteredRecipes: Recipe[];
  recipes: Recipe[];
  productions: ProductionBatch[];
  shippings: ShippingDocument[]; // Added shippings property to the interface
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeContentTabs: React.FC<RecipeContentTabsProps> = ({
  activeTab,
  setActiveTab,
  categoryFilter,
  setCategoryFilter,
  allTags,
  selectedTags,
  onTagToggle,
  filteredRecipes,
  recipes,
  productions,
  shippings, // Added shippings to destructuring
  onEdit,
  onDelete,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  const { isChefCardOpen, selectedRecipe, openChefCard, closeChefCard } = useChefCardDialog();
  
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <div className="flex justify-between items-start mb-4">
          <TabsList>
            <TabsTrigger value="all">Все рецепты</TabsTrigger>
            <TabsTrigger value="in-stock">На складе</TabsTrigger>
          </TabsList>
          
          {allTags.length > 0 && (
            <RecipeTagFilter 
              allTags={allTags} 
              selectedTags={selectedTags}
              onTagToggle={onTagToggle}
            />
          )}
        </div>
        
        <TabsContent value="all">
          <RecipeCategoryFilter 
            categoryFilter={categoryFilter} 
            onCategoryChange={setCategoryFilter} 
          />
          
          <RecipesList 
            recipes={filteredRecipes} 
            productions={productions}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={openChefCard}
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
            getRecipeName={getRecipeName}
            getRecipeUnit={getRecipeUnit}
          />
        </TabsContent>
        
        <TabsContent value="in-stock">
          <InStockRecipes 
            recipes={recipes.filter(r => {
              // Only filter by tags in the In-Stock tab, not by category
              const matchesTags = selectedTags.length === 0 || 
                (r.tags && selectedTags.every(tagId => 
                  r.tags.some(tag => tag.id === tagId)
                ));
              return matchesTags;
            })}
            productions={productions}
            shippings={shippings} // Pass the shippings prop to InStockRecipes
            getRecipeUnit={getRecipeUnit}
          />
        </TabsContent>
      </Tabs>

      <ChefCardDialog
        recipe={selectedRecipe}
        isOpen={isChefCardOpen}
        onClose={closeChefCard}
        onEdit={onEdit}
        getIngredientName={getIngredientName}
        getIngredientUnit={getIngredientUnit}
        getRecipeName={getRecipeName}
        getRecipeUnit={getRecipeUnit}
      />
    </>
  );
};

export default RecipeContentTabs;
