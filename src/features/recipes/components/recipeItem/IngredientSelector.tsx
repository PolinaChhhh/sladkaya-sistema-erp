
import React from 'react';
import { Ingredient } from '@/store/types';
import { PackageOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IngredientSelectorProps {
  ingredientId: string;
  ingredients: Ingredient[];
  onIngredientChange: (id: string) => void;
  fromSemiFinished?: {
    recipeId: string;
    recipeName: string;
  };
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  ingredientId,
  ingredients,
  onIngredientChange,
  fromSemiFinished
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={ingredientId || ''}
        onValueChange={onIngredientChange}
      >
        <SelectTrigger className={`w-full ${fromSemiFinished ? 'border-blue-200' : ''}`}>
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

      {fromSemiFinished && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-blue-500">
                <PackageOpen size={16} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Из полуфабриката: {fromSemiFinished.recipeName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default IngredientSelector;
