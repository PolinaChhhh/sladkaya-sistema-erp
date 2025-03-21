
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TypeSelectorProps {
  type: 'ingredient' | 'recipe';
  onTypeChange: (type: 'ingredient' | 'recipe') => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ type, onTypeChange }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as 'ingredient' | 'recipe')}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ingredient">Ингредиент</SelectItem>
          <SelectItem value="recipe">Полуфабрикат</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeSelector;
