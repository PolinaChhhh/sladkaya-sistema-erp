
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/recipeStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
}) => {
  // Force all items to be ingredients for now
  useEffect(() => {
    if (item.type !== 'ingredient') {
      onUpdate(index, 'type', 'ingredient');
      
      if (ingredients.length > 0 && !item.ingredientId) {
        onUpdate(index, 'ingredientId', ingredients[0].id);
      }
      
      // Clear any recipe ID
      if (item.recipeId) {
        onUpdate(index, 'recipeId', undefined);
      }
    }
  }, [item, ingredients, index, onUpdate]);
  
  const handleIngredientChange = (id: string) => {
    onUpdate(index, 'ingredientId', id);
  };
  
  const getDisplayUnit = () => {
    if (item.ingredientId) {
      return getIngredientUnit(item.ingredientId);
    }
    return '';
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="space-y-2">
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
