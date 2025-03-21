
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecipeItem, Recipe, Ingredient } from '@/store/recipeStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const selectedType = item.type || 'ingredient';
  const selectedId = selectedType === 'ingredient' ? item.ingredientId || '' : item.recipeId || '';
  
  // Set a default ID when switching between types if none is selected
  useEffect(() => {
    if (selectedType === 'ingredient' && !item.ingredientId && ingredients.length > 0) {
      onUpdate(index, 'ingredientId', ingredients[0].id);
    } else if (selectedType === 'recipe' && !item.recipeId && recipes.length > 0) {
      onUpdate(index, 'recipeId', recipes[0].id);
    }
  }, [selectedType, item.ingredientId, item.recipeId, ingredients, recipes, index, onUpdate]);
  
  const handleTypeChange = (type: string) => {
    console.log('Changing type to:', type);
    
    if (type === 'ingredient') {
      // First clear recipe related fields
      onUpdate(index, 'recipeId', undefined);
      // Then set type and default ingredient
      onUpdate(index, 'type', 'ingredient');
      
      // Set default ingredient if available
      if (ingredients.length > 0) {
        onUpdate(index, 'ingredientId', ingredients[0].id);
      } else {
        onUpdate(index, 'ingredientId', '');
      }
    } else if (type === 'recipe') {
      // First clear ingredient related fields
      onUpdate(index, 'ingredientId', undefined);
      // Then set type and default recipe
      onUpdate(index, 'type', 'recipe');
      
      // Set default recipe if available
      if (recipes.length > 0) {
        onUpdate(index, 'recipeId', recipes[0].id);
      } else {
        onUpdate(index, 'recipeId', '');
      }
    }
  };
  
  const handleIdChange = (id: string) => {
    console.log('Changing ID to:', id, 'for type:', selectedType);
    
    if (selectedType === 'ingredient') {
      onUpdate(index, 'ingredientId', id);
    } else {
      onUpdate(index, 'recipeId', id);
    }
  };
  
  const getDisplayUnit = () => {
    if (selectedType === 'ingredient' && item.ingredientId) {
      return getIngredientUnit(item.ingredientId);
    } else if (selectedType === 'recipe' && item.recipeId) {
      return getRecipeUnit(item.recipeId);
    }
    return '';
  };

  // Debug logs to see what's happening
  console.log(`RecipeItemRow - item:`, item);
  console.log(`RecipeItemRow - selectedType:`, selectedType);
  console.log(`RecipeItemRow - selectedId:`, selectedId);
  console.log(`RecipeItemRow - recipes available:`, recipes);

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="space-y-2">
        <Tabs defaultValue={selectedType} value={selectedType} onValueChange={handleTypeChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredient">Ингредиент</TabsTrigger>
            <TabsTrigger value="recipe">Рецепт</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredient" className="mt-2">
            <Select
              value={item.ingredientId || ''}
              onValueChange={handleIdChange}
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
          </TabsContent>
          
          <TabsContent value="recipe" className="mt-2">
            <Select
              value={item.recipeId || ''}
              onValueChange={handleIdChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите рецепт" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
        
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
