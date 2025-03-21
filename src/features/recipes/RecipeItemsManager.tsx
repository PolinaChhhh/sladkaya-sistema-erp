
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
}) => {
  // For now, we'll only allow ingredients (disabled recipes temporarily)
  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
    
    // Create a new ingredient item
    const newItem: RecipeItem = { 
      type: 'ingredient', 
      ingredientId: defaultId, 
      amount: 0 
    };
    
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
        <Label>Ингредиенты</Label>
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
              recipes={[]} // Temporarily passing empty array
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
              onUpdate={updateRecipeItem}
              onRemove={removeRecipeItem}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">Нет добавленных ингредиентов</p>
      )}
    </div>
  );
};

export default RecipeItemsManager;
