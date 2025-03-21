
import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecipeItem, RecipeTag } from '@/store/types';

interface RecipeIngredientsProps {
  ingredients: RecipeItem[];
  semiFinished: RecipeItem[];
  tags?: RecipeTag[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  getRecipeName: (id: string) => string;
  getRecipeUnit: (id: string) => string;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
  semiFinished,
  tags,
  getIngredientName,
  getIngredientUnit,
  getRecipeName,
  getRecipeUnit
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-confection-700">
        <UtensilsCrossed className="h-5 w-5 text-mint-600" />
        Ингредиенты
      </h2>
      
      <div className="space-y-5">
        {ingredients.length > 0 && (
          <div className="bg-white border border-cream-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Основные ингредиенты</h3>
            <ul className="space-y-2 divide-y divide-cream-100">
              {ingredients.map((item, idx) => (
                <li key={`ing-${idx}`} className="pt-2 first:pt-0">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{getIngredientName(item.ingredientId || '')}</span>
                    <span className="font-medium">
                      {item.amount.toFixed(2)} {getIngredientUnit(item.ingredientId || '')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {semiFinished.length > 0 && (
          <div className="bg-white border border-mint-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Полуфабрикаты</h3>
            <ul className="space-y-2 divide-y divide-mint-100">
              {semiFinished.map((item, idx) => (
                <li key={`semi-${idx}`} className="pt-2 first:pt-0">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{getRecipeName(item.recipeId || '')}</span>
                    <span className="font-medium">
                      {item.amount.toFixed(2)} {getRecipeUnit(item.recipeId || '')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge 
                  key={tag.id}
                  className="text-xs font-normal text-white rounded-full px-3"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeIngredients;
