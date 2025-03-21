
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/recipeStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Package2, Box } from 'lucide-react';

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
  React.useEffect(() => {
    // If we're forcing recipe items or have a forced type, ensure the type is set correctly
    if (forcedType) {
      if (item.type !== forcedType) {
        onUpdate(index, 'type', forcedType);
        
        if (forcedType === 'ingredient' && ingredients.length > 0) {
          onUpdate(index, 'ingredientId', ingredients[0].id);
          onUpdate(index, 'recipeId', undefined);
        } else if (forcedType === 'recipe' && recipes.length > 0) {
          onUpdate(index, 'recipeId', recipes[0].id);
          onUpdate(index, 'ingredientId', undefined);
        }
      }
    } else if (forceRecipeItems && item.type !== 'recipe') {
      onUpdate(index, 'type', 'recipe');
      if (recipes.length > 0) {
        onUpdate(index, 'recipeId', recipes[0].id);
      }
      onUpdate(index, 'ingredientId', undefined);
    }
  }, [forceRecipeItems, forcedType, item.type, recipes, ingredients, index, onUpdate]);

  const handleTypeChange = (type: 'ingredient' | 'recipe') => {
    if (forcedType || (forceRecipeItems && type !== 'recipe')) {
      return; // Don't allow changing type if it's forced
    }
    
    onUpdate(index, 'type', type);
    
    // Clear the current selection
    if (type === 'ingredient') {
      onUpdate(index, 'recipeId', undefined);
      if (ingredients.length > 0) {
        onUpdate(index, 'ingredientId', ingredients[0].id);
      }
    } else {
      onUpdate(index, 'ingredientId', undefined);
      if (recipes.length > 0) {
        onUpdate(index, 'recipeId', recipes[0].id);
      }
    }
  };
  
  const handleIngredientChange = (id: string) => {
    onUpdate(index, 'ingredientId', id);
  };
  
  const handleRecipeChange = (id: string) => {
    onUpdate(index, 'recipeId', id);
  };
  
  const getDisplayUnit = () => {
    if (item.type === 'ingredient' && item.ingredientId) {
      return getIngredientUnit(item.ingredientId);
    } else if (item.type === 'recipe' && item.recipeId) {
      return getRecipeUnit(item.recipeId);
    }
    return '';
  };

  // Determine which type we're displaying
  const displayType = forcedType || (forceRecipeItems ? 'recipe' : item.type);

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="space-y-2">
        {allowRecipeItems && !forceRecipeItems && !forcedType && (
          <ToggleGroup type="single" value={item.type} 
            onValueChange={(value) => {
              if (value) handleTypeChange(value as 'ingredient' | 'recipe');
            }}
            className="justify-start mb-2"
          >
            <ToggleGroupItem value="ingredient" aria-label="Ingredient">
              <Package2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Ингредиент</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="recipe" aria-label="Recipe">
              <Box className="h-4 w-4 mr-1" />
              <span className="text-xs">Полуфабрикат</span>
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        
        {displayType === 'ingredient' && (
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
        )}
        
        {displayType === 'recipe' && (
          <Select
            value={item.recipeId || ''}
            onValueChange={handleRecipeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите полуфабрикат" />
            </SelectTrigger>
            <SelectContent>
              {recipes.map((recipe) => (
                <SelectItem key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <div className="flex items-center gap-1 mt-2">
          <Input 
            type="number"
            min="0.01"
            step="0.01"
            className="w-24"
            value={item.amount || ''}
            onChange={(e) => onUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
            placeholder="Кол-во"
          />
          
          <span className="text-sm text-gray-500 w-8">
            {getDisplayUnit()}
          </span>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(index)}
            className="ml-auto"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeItemRow;
