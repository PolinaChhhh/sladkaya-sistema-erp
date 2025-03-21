
import React from 'react';
import { Edit, Trash2, Clock, Package2, Component, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Recipe, ProductionBatch } from '@/store/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface RecipeCardProps {
  recipe: Recipe;
  productions?: ProductionBatch[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onViewDetails?: (recipe: Recipe) => void;
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  productions = [],
  onEdit,
  onDelete,
  onViewDetails,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  // Format the last production date
  const formattedLastProduced = recipe.lastProduced
    ? formatDistanceToNow(new Date(recipe.lastProduced), { addSuffix: true, locale: ru })
    : 'Никогда';
  
  // Count the number of productions for this recipe
  const productionCount = productions.filter(p => p.recipeId === recipe.id).length;
  
  // Define styling for different categories
  const getCategoryIcon = () => {
    if (recipe.category === 'finished') {
      return <Package2 className="h-5 w-5 text-green-600" />;
    } else {
      return <Component className="h-5 w-5 text-blue-600" />;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <div className={`p-2 rounded-full ${recipe.category === 'finished' ? 'bg-green-100' : 'bg-blue-100'}`}>
              {getCategoryIcon()}
            </div>
            {recipe.name}
          </CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(recipe)}
              title="Редактировать"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500" 
              onClick={() => onDelete(recipe)}
              title="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        {recipe.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
        )}
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Выход:</span>
            <span>{recipe.output} {recipe.outputUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ингредиентов:</span>
            <span>{recipe.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Произведено:</span>
            <span>{productionCount} раз</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-col items-stretch gap-2">
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Clock className="h-3 w-3" />
          <span>Производилось: {formattedLastProduced}</span>
        </div>
        
        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.tags.map(tag => (
              <div 
                key={tag.id} 
                className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
                title={tag.name}
              >
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {onViewDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full text-confection-600 hover:text-confection-700 hover:bg-confection-50"
            onClick={() => onViewDetails(recipe)}
          >
            Открыть карточку шеф-повара
            <ChevronsRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
