
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filterIngredients = (value: string) => {
    return ingredients.filter((ingredient) => 
      ingredient.name.toLowerCase().includes(value.toLowerCase())
    );
  };
  
  const handleTriggerClick = (e: React.MouseEvent) => {
    // This prevents the default navigation behavior
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={isOpen} 
          className="flex-1 justify-between"
          type="button"
          onClick={handleTriggerClick}
        >
          {selectedIngredientId ? getIngredientName(selectedIngredientId) : "Выберите ингредиент"}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Поиск ингредиента..." 
            className="h-9" 
            value={searchValue}
            onValueChange={setSearchValue}
            autoFocus={true}
          />
          <CommandEmpty>Ингредиенты не найдены.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filterIngredients(searchValue).map((ingredient) => (
              <CommandItem
                key={ingredient.id}
                value={ingredient.name}
                onSelect={() => {
                  onSelect(ingredient.id);
                  setSearchValue("");
                  setIsOpen(false);
                }}
              >
                {ingredient.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IngredientSelector;
