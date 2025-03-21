
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/types';
import TypeSelector from './components/recipeItem/TypeSelector';
import IngredientSelector from './components/recipeItem/IngredientSelector';
import RecipeSelector from './components/recipeItem/RecipeSelector';
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
  // If forcedType is set, use it, otherwise respect the item's type or default to 'ingredient'
  const effectiveType = forcedType || item.type || 'ingredient';

  React.useEffect(() => {
    // If forcedType is set, we need to update the item type
    if (forcedType && item.type !== forcedType) {
      onUpdate(index, 'type', forcedType);
    }
    
    // If we're forcing ingredient type, but no ingredient ID is set, set a default
    if ((forcedType === 'ingredient' || effectiveType === 'ingredient') && !item.ingredientId && ingredients.length > 0) {
      onUpdate(index, 'ingredientId', ingredients[0].id);
      onUpdate(index, 'recipeId', undefined);
    }
    
    // If we're forcing recipe type, but no recipe ID is set, set a default
    if ((forcedType === 'recipe' || effectiveType === 'recipe') && !item.recipeId && recipes.length > 0) {
      onUpdate(index, 'recipeId', recipes[0].id);
      onUpdate(index, 'ingredientId', undefined);
    }
  }, [forcedType, index, onUpdate, ingredients, recipes, item.type, item.ingredientId, item.recipeId, effectiveType]);

  const handleTypeChange = (type: 'ingredient' | 'recipe') => {
    onUpdate(index, 'type', type);
    
    if (type === 'ingredient') {
      if (ingredients.length > 0) {
        onUpdate(index, 'ingredientId', ingredients[0].id);
      }
      onUpdate(index, 'recipeId', undefined);
    } else {
      if (recipes.length > 0) {
        onUpdate(index, 'recipeId', recipes[0].id);
      }
      onUpdate(index, 'ingredientId', undefined);
    }
  };
  
  const handleIngredientChange = (id: string) => {
    onUpdate(index, 'ingredientId', id);
  };
  
  const handleRecipeChange = (id: string) => {
    onUpdate(index, 'recipeId', id);
  };
  
  const handleAmountChange = (amount: number) => {
    onUpdate(index, 'amount', amount);
  };
  
  const getDisplayUnit = () => {
    if (item.ingredientId) {
      return getIngredientUnit(item.ingredientId);
    } else if (item.recipeId) {
      return getRecipeUnit(item.recipeId);
    }
    return '';
  };

  // Check if this ingredient comes from a semi-finished product
  const isFromSemiFinished = !!item.fromSemiFinished;

  return (
    <div className={`p-3 rounded-md ${isFromSemiFinished ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="space-y-2">
        {/* Only show type selector if both recipe items are allowed AND not forced to a specific type */}
        {allowRecipeItems && !forcedType && (
          <TypeSelector 
            type={effectiveType}
            onTypeChange={handleTypeChange}
          />
        )}
        
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            {effectiveType === 'ingredient' ? (
              <IngredientSelector 
                ingredientId={item.ingredientId || ''}
                ingredients={ingredients}
                onIngredientChange={handleIngredientChange}
                fromSemiFinished={item.fromSemiFinished}
              />
            ) : (
              allowRecipeItems && (
                <RecipeSelector
                  recipeId={item.recipeId || ''}
                  recipes={recipes}
                  onRecipeChange={handleRecipeChange}
                />
              )
            )}
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
    </div>
  );
};

export default RecipeItemRow;
