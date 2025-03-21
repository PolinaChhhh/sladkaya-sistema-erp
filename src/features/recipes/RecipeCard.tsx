
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/store/recipeStore';

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
  return (
    <div className="glass p-5 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{recipe.name}</h3>
          <div className="flex gap-3 text-sm text-gray-500 mt-1">
            <p>Выход: {recipe.output} {recipe.outputUnit}</p>
            {recipe.lossPercentage > 0 && (
              <p>Потери: {recipe.lossPercentage}%</p>
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
          <h4 className="text-sm font-medium text-gray-600 mb-2">Состав:</h4>
          <div className="space-y-1">
            {recipe.items.map((item, idx) => {
              let name = 'Неизвестный элемент';
              let unit = '';
              
              if (item.type === 'ingredient' && item.ingredientId) {
                name = getIngredientName(item.ingredientId);
                unit = getIngredientUnit(item.ingredientId);
              } else if (item.type === 'recipe' && item.recipeId) {
                name = `🍳 ${getRecipeName(item.recipeId)}`;
                unit = getRecipeUnit(item.recipeId);
              }
              
              return (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{name}</span>
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
