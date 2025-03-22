
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/types';
import IngredientSelector from './components/recipeItem/IngredientSelector';
import AmountInput from './components/recipeItem/AmountInput';

interface RecipeItemRowProps {
  item: RecipeItem;
  index: number;
  ingredients: Ingredient[];
  recipes: Recipe[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
  onUpdate: (index: number, field: keyof RecipeItem, value: any) => void;
  onRemove: (index: number) => void;
  allowRecipeItems?: boolean;
  forceRecipeItems?: boolean;
  forcedType?: 'ingredient' | 'recipe';
}

const RecipeItemRow: React.FC<RecipeItemRowProps> = ({
  item,
  index,
  ingredients,
  recipes,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit,
  onUpdate,
  onRemove,
  allowRecipeItems = false,
  forceRecipeItems = false,
  forcedType,
}) => {
  // The effective type is always ingredient in this simplified version
  const effectiveType = 'ingredient';

  useEffect(() => {
    // If we're forcing ingredient type, but no ingredient ID is set, set a default
    if (!item.ingredientId && ingredients.length > 0) {
      onUpdate(index, 'ingredientId', ingredients[0].id);
      onUpdate(index, 'type', 'ingredient');
    }
  }, [index, onUpdate, ingredients, item.ingredientId]);
  
  const handleIngredientChange = (id: string) => {
    onUpdate(index, 'ingredientId', id);
  };
  
  const handleAmountChange = (amount: number) => {
    onUpdate(index, 'amount', amount);
  };
  
  const getDisplayUnit = () => {
    if (item.ingredientId) {
      return getIngredientUnit(item.ingredientId);
    }
    return '';
  };

  // Check if this ingredient comes from a semi-finished product
  const isFromSemiFinished = !!item.fromSemiFinished;

  return (
    <div className={`p-3 rounded-md ${isFromSemiFinished ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <IngredientSelector 
            ingredientId={item.ingredientId || ''}
            ingredients={ingredients}
            onIngredientChange={handleIngredientChange}
            fromSemiFinished={item.fromSemiFinished}
          />
        </div>
        
        <AmountInput 
          amount={item.amount}
          unit={getDisplayUnit()}
          onAmountChange={handleAmountChange}
        />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeItemRow;
