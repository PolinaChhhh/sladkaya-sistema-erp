
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Ingredient, RecipeItem, Recipe, RecipeCategory } from '@/store/types';
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
  category: RecipeCategory;
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
  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
      
    const defaultId = ingredients.length > 0 ? ingredients[0].id : '';
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
  const allowRecipeItems = category === 'semi-finished';

  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between items-center">
        <Label>
          {category === 'finished' ? 'Ингредиенты' : 'Состав полуфабриката'}
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
              recipes={allowRecipeItems ? recipes.filter(r => r.id !== currentRecipeId) : []}
              getIngredientName={getIngredientName}
              getIngredientUnit={getIngredientUnit}
              getRecipeName={getRecipeName}
              getRecipeUnit={getRecipeUnit}
              onUpdate={updateRecipeItem}
              onRemove={removeRecipeItem}
              allowRecipeItems={allowRecipeItems}
              forceRecipeItems={false}
              forcedType={category === 'finished' ? 'ingredient' : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">
          {category === 'finished' 
            ? 'Нет добавленных ингредиентов' 
            : 'Нет добавленных компонентов'}
        </p>
      )}
    </div>
  );
};

export default RecipeItemsManager;
