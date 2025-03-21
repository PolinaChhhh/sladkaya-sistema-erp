
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecipeCategoryFilter from './RecipeCategoryFilter';
import RecipeTagFilter from './RecipeTagFilter';
import RecipesList from './RecipesList';
import InStockRecipes from './InStockRecipes';
import { Recipe, ProductionBatch, RecipeTag } from '@/store/types';

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
  onEdit,
  onDelete,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  return (
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
          onEdit={onEdit}
          onDelete={onDelete}
          getIngredientName={getIngredientName}
          getIngredientUnit={getIngredientUnit}
          getRecipeName={getRecipeName}
          getRecipeUnit={getRecipeUnit}
        />
      </TabsContent>
      
      <TabsContent value="in-stock">
        <RecipeCategoryFilter 
          categoryFilter={categoryFilter} 
          onCategoryChange={setCategoryFilter} 
        />
        
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
  );
};

export default RecipeContentTabs;
