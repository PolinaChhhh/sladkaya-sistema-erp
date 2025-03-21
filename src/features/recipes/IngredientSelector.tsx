
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Ingredient } from '@/store/recipeStore';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  selectedIngredientId: string;
  onSelect: (ingredientId: string) => void;
  getIngredientName: (id: string) => string;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  ingredients,
  selectedIngredientId,
  onSelect,
  getIngredientName,
}) => {
  return (
    <Select
      value={selectedIngredientId || ""}
      onValueChange={onSelect}
    >
      <SelectTrigger className="flex-1">
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
  );
};

export default IngredientSelector;
