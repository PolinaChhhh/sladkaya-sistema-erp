
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Ingredient, RecipeItem, Recipe } from '@/store/recipeStore';
import { toast } from 'sonner';
import RecipeItemRow from './RecipeItemRow';

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
  category: 'semi-finished' | 'finished';
}

const RecipeItemsManager: React.FC<RecipeItemsManagerProps> = ({
  items,
  ingredients,
  recipes,
  currentRecipeId,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
  onUpdateItems,
  category,
}) => {
  // Filter semi-finished recipes for use in finished products
  const availableRecipes = recipes.filter(recipe => 
    recipe.category === 'semi-finished' && recipe.id !== currentRecipeId
  );

  const addRecipeItem = () => {
    // For finished products, default to recipe type
    // For semi-finished products, default to ingredient type
    const defaultType = category === 'finished' ? 'recipe' : 'ingredient';
    
    if (defaultType === 'ingredient' && ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    if (defaultType === 'recipe' && availableRecipes.length === 0) {
      toast.error('Сначала создайте полуфабрикаты');
      return;
    }
    
    let newItem: RecipeItem;
    
    if (defaultType === 'ingredient') {
      const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
      newItem = { 
        type: 'ingredient', 
        ingredientId: defaultId, 
        amount: 0 
      };
    } else {
      const defaultId = availableRecipes.length > 0 ? availableRecipes[0].id : '';
      newItem = { 
        type: 'recipe', 
        recipeId: defaultId, 
        amount: 0 
      };
    }
    
    console.log('Added new recipe item:', newItem);
    onUpdateItems([...items, newItem]);
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...items];
    
    // Create a copy of the item to modify
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Log the update for debugging
    console.log(`Updated recipe item: ${index} ${field} ${value}`, newItems[index]);
    
    onUpdateItems(newItems);
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdateItems(newItems);
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between items-center">
        <Label>
          {category === 'finished' ? 'Полуфабрикаты и ингредиенты' : 'Ингредиенты'}
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
          <Plus className="h-3 w-3 mr-1" /> Добавить
        </Button>
      </div>
      
      {items.length > 0 ? (
        <div className="space-y-3 mt-3">
          {items.map((item, index) => (
            <RecipeItemRow
              key={index}
              item={item}
              index={index}
              ingredients={ingredients}
              recipes={availableRecipes}
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
              onUpdate={updateRecipeItem}
              onRemove={removeRecipeItem}
              allowRecipeItems={category === 'finished'}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">
          {category === 'finished' 
            ? 'Нет добавленных полуфабрикатов или ингредиентов' 
            : 'Нет добавленных ингредиентов'}
        </p>
      )}
    </div>
  );
};

export default RecipeItemsManager;
