
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IngredientFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'ingredient' | 'semifinal';
  setFilterType: (type: 'all' | 'ingredient' | 'semifinal') => void;
  ingredientTypeFilter: string;
  setIngredientTypeFilter: (type: string) => void;
  ingredientTypes: string[];
}

const IngredientFilter: React.FC<IngredientFilterProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  ingredientTypeFilter,
  setIngredientTypeFilter,
  ingredientTypes
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Поиск ингредиентов..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип ингредиента" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="ingredient">Ингредиенты</SelectItem>
            <SelectItem value="semifinal">Полуфабрикаты</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={ingredientTypeFilter} onValueChange={(value: any) => setIngredientTypeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип ингредиента" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {ingredientTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IngredientFilter;
