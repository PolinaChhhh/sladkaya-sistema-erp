
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
      <div className="flex items-center gap-2">
        <IngredientSelector 
          ingredients={ingredients}
          selectedIngredientId={item.ingredientId}
          onSelect={(ingredientId) => onUpdate(index, 'ingredientId', ingredientId)}
          getIngredientName={getIngredientName}
        />
        
        <Input 
          type="number"
          min="0.01"
          step="0.01"
          className="w-24"
          value={item.amount}
          onChange={(e) => onUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
          placeholder="Кол-во"
        />
        
        <span className="text-sm text-gray-500 w-8">
          {getIngredientUnit(item.ingredientId)}
        </span>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeItemRow;
