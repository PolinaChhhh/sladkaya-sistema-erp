
import React from 'react';
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
  recipes = [],
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
      
    onUpdateItems([...items, newItem]);
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdateItems(newItems);
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdateItems(newItems);
  };

  // Handle semi-finished selection with amount
  const handleAddSemiFinishedIngredients = (recipe: Recipe, amount: number) => {
    if (!recipe || amount <= 0) {
      toast.error('Укажите корректное количество полуфабриката');
      return;
    }
    
    // Expand the semi-finished recipe into its ingredient components
    const expandedIngredients = expandSemiFinishedToIngredients(
      recipe,
      amount,
      recipes
    );

    if (expandedIngredients.length === 0) {
      toast.warning(`У полуфабриката "${recipe.name}" нет ингредиентов`);
      return;
    }

    // Add all expanded ingredients to the current recipe
    onUpdateItems([...items, ...expandedIngredients]);
    
    toast.success(
      `Добавлены ингредиенты из "${recipe.name}" (${amount} гр)`
    );
  };

  // Get all semi-finished recipes (excluding the current one if editing)
  const semiFinishedRecipes = recipes.filter(
    recipe => recipe.category === 'semi-finished' && recipe.id !== currentRecipeId
  );

  return (
    <div className="space-y-3 mt-2">
      <RecipeItemsHeader 
        category={category}
        semiFinishedRecipes={semiFinishedRecipes}
        onAddItem={addRecipeItem}
        onSelectSemiFinished={handleAddSemiFinishedIngredients}
      />
      
      {(!items || items.length === 0) ? (
        <EmptyItemsMessage category={category} />
      ) : (
        <div className="space-y-3 mt-3">
          {items.map((item, index) => (
            <RecipeItemRow
              key={index}
              item={item}
              index={index}
              ingredients={ingredients}
              recipes={[]} // We don't allow recipe items anymore
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
              onUpdate={updateRecipeItem}
              onRemove={removeRecipeItem}
              allowRecipeItems={false}
              forcedType="ingredient"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeItemsManager;
