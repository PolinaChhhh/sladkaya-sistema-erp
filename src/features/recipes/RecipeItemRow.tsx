
import React from 'react';
import { X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
          <div className="flex items-center gap-2 mb-2">
            <Select
              value={effectiveType}
              onValueChange={(value) => handleTypeChange(value as 'ingredient' | 'recipe')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingredient">Ингредиент</SelectItem>
                <SelectItem value="recipe">Полуфабрикат</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            {effectiveType === 'ingredient' ? (
              <div className="flex items-center gap-2">
                <Select
                  value={item.ingredientId || ''}
                  onValueChange={handleIngredientChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите ингредиент" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isFromSemiFinished && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-blue-500">
                          <Info size={16} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Из полуфабриката: {item.fromSemiFinished.recipeName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ) : (
              allowRecipeItems && (
                <Select
                  value={item.recipeId || ''}
                  onValueChange={handleRecipeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите полуфабрикат" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes
                      .filter(recipe => recipe.category === 'semi-finished')
                      .map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )
            )}
          </div>
          
          <div className="flex items-center gap-1 min-w-[120px]">
            <Input 
              type="number"
              min="0.01"
              step="0.01"
              className="w-20"
              value={item.amount || ''}
              onChange={(e) => onUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
              placeholder="Кол-во"
            />
            
            <span className="text-sm text-gray-500 w-8">
              {getDisplayUnit()}
            </span>
          </div>
          
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
