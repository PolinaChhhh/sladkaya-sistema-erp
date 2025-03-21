
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/store/recipeStore';
import { Badge } from '@/components/ui/badge';

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

      {/* Display tags if present */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.map(tag => (
            <div 
              key={tag.id}
              className="rounded-full w-6 h-6 flex items-center justify-center"
              style={{ backgroundColor: tag.color }}
              title={tag.name}
            >
              <span className="text-white text-xs uppercase font-bold">
                {tag.name.charAt(0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
