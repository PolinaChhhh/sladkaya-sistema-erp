
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/store/recipeStore';
import { Badge } from '@/components/ui/badge';
import { Package2, Box } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onEdit, 
  onDelete,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  const categoryText = recipe.category === 'semi-finished' ? 'Полуфабрикат' : 'Готовый продукт';
  const categoryColor = recipe.category === 'semi-finished' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

  return (
    <div className="glass p-5 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{recipe.name}</h3>
            <Badge className={`${categoryColor} hover:${categoryColor}`}>
              {categoryText}
            </Badge>
          </div>
          <div className="flex gap-3 text-sm text-gray-500 mt-1">
            <p>Выход: {recipe.output} {recipe.outputUnit}</p>
            {recipe.lossPercentage !== undefined && recipe.lossPercentage > 0 && (
              <p>Потери: {recipe.lossPercentage.toFixed(2)}%</p>
            )}
          </div>
          {recipe.description && (
            <p className="text-gray-700 mt-2 text-sm">{recipe.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(recipe)}>
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(recipe)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      {recipe.items.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            {recipe.category === 'finished' ? 'Состав (полуфабрикаты):' : 'Состав (ингредиенты):'}
          </h4>
          <div className="space-y-1">
            {recipe.items.map((item, idx) => {
              let name = 'Неизвестный элемент';
              let unit = '';
              let icon = null;
              
              if (item.type === 'ingredient' && item.ingredientId) {
                name = getIngredientName(item.ingredientId);
                unit = getIngredientUnit(item.ingredientId);
                icon = <Package2 className="h-3 w-3 inline mr-1 text-gray-500" />;
              } else if (item.type === 'recipe' && item.recipeId) {
                name = getRecipeName(item.recipeId);
                unit = getRecipeUnit(item.recipeId);
                icon = <Box className="h-3 w-3 inline mr-1 text-gray-500" />;
              }
              
              return (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{icon} {name}</span>
                  <span>{item.amount} {unit}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
