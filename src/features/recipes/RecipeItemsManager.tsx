
import React, { useState } from 'react';
import { Ingredient, RecipeItem, Recipe, RecipeCategory } from '@/store/types';
import { toast } from 'sonner';
import RecipeItemRow from './RecipeItemRow';
import { expandSemiFinishedToIngredients } from './utils/expandSemiFinished';
import RecipeItemsHeader from './components/recipeItem/RecipeItemsHeader';
import EmptyItemsMessage from './components/recipeItem/EmptyItemsMessage';

interface RecipeItemsManagerProps {
  items: RecipeItem[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  currentRecipeId?: string;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
  onUpdateItems: (items: RecipeItem[]) => void;
  category: RecipeCategory;
}

const RecipeItemsManager: React.FC<RecipeItemsManagerProps> = ({
  items,
  ingredients,
  recipes = [], // Default to empty array
  currentRecipeId,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
  onUpdateItems,
  category,
}) => {
  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
      
    const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
    
    // Always create ingredient-type items
    const newItem: RecipeItem = { 
      type: 'ingredient', 
      ingredientId: defaultId, 
      amount: 0,
      isPackaging: false 
    };
      
    console.log('Added new ingredient item:', newItem);
    onUpdateItems([...items, newItem]);
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...items];
    
    // Create a copy of the item to modify
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Log the update for debugging
    console.log(`Updated recipe item: ${index} ${String(field)} ${value}`, newItems[index]);
    
    onUpdateItems(newItems);
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdateItems(newItems);
  };

  // For finished products, only ingredients are allowed
  // For semi-finished products, also only ingredients are allowed now
  const allowRecipeItems = false;

  // Handle semi-finished selection with amount
  const handleAddSemiFinishedIngredients = (recipe: Recipe, amount: number) => {
    if (!recipe) {
      toast.error('Полуфабрикат не выбран');
      return;
    }
    
    if (amount <= 0) {
      toast.error('Укажите количество больше нуля');
      return;
    }
    
    console.log(`Adding semi-finished: ${recipe.name} - ${amount}g`);
    
    // Expand the semi-finished recipe into its ingredient components
    const expandedIngredients = expandSemiFinishedToIngredients(
      recipe,
      amount,
      recipes
    );

    // Add all expanded ingredients to the current recipe
    onUpdateItems([...items, ...expandedIngredients]);
    
    toast.success(
      `Добавлены ингредиенты из "${recipe.name}" (${amount} гр)`
    );
  };

  // Ensure recipes is always an array before filtering
  const recipesArray = Array.isArray(recipes) ? recipes : [];
  
  // Get all semi-finished recipes (excluding the current one if editing)
  const semiFinishedRecipes = recipesArray.filter(
    recipe => recipe.category === 'semi-finished' && recipe.id !== currentRecipeId
  );

  const renderItems = () => {
    if (!items || items.length === 0) {
      return <EmptyItemsMessage category={category} />;
    }

    return (
      <div className="space-y-3 mt-3">
        {items.map((item, index) => (
          <RecipeItemRow
            key={index}
            item={item}
            index={index}
            ingredients={ingredients}
            recipes={[]} // Empty array since we don't allow recipe items anymore for semi-finished
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
            getRecipeName={getRecipeName}
            getRecipeUnit={getRecipeUnit}
            onUpdate={updateRecipeItem}
            onRemove={removeRecipeItem}
            allowRecipeItems={allowRecipeItems}
            forceRecipeItems={false}
            forcedType="ingredient" // Force all items to be ingredients
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 mt-2">
      <RecipeItemsHeader 
        category={category}
        semiFinishedRecipes={semiFinishedRecipes}
        onAddItem={addRecipeItem}
        onSelectSemiFinished={handleAddSemiFinishedIngredients}
      />
      
      {renderItems()}
    </div>
  );
};

export default RecipeItemsManager;
