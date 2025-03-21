
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RecipeItem } from '@/store/recipeStore';
import IngredientSelector from './IngredientSelector';

interface RecipeItemRowProps {
  item: RecipeItem;
  index: number;
  ingredients: any[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
  onUpdate: (index: number, field: keyof RecipeItem, value: any) => void;
  onRemove: (index: number) => void;
}

const RecipeItemRow: React.FC<RecipeItemRowProps> = ({
  item,
  index,
  ingredients,
  getIngredientName,
  getIngredientUnit,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <IngredientSelector 
          ingredients={ingredients}
          selectedIngredientId={item.ingredientId}
          onSelect={(ingredientId) => onUpdate(index, 'ingredientId', ingredientId)}
          getIngredientName={getIngredientName}
        />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Input 
            type="number"
            min="0.01"
            step="0.01"
            className="w-full"
            value={item.amount}
            onChange={(e) => onUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
            placeholder="Количество"
          />
          <span className="text-sm text-gray-500 w-8">
            {getIngredientUnit(item.ingredientId)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-full relative">
            <Input 
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full pr-8"
              value={item.lossPercentage || 0}
              onChange={(e) => onUpdate(index, 'lossPercentage', parseFloat(e.target.value) || 0)}
              placeholder="Потери"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">%</span>
          </div>
          <Label className="text-xs text-gray-500 whitespace-nowrap" htmlFor={`loss-${index}`}>
            Потери
          </Label>
        </div>
      </div>
    </div>
  );
};

export default RecipeItemRow;
