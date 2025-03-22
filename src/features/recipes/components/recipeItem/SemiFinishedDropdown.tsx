
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/store/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SemiFinishedDropdownProps {
  semiFinishedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const SemiFinishedDropdown: React.FC<SemiFinishedDropdownProps> = ({ 
  semiFinishedRecipes, 
  onSelectRecipe 
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (semiFinishedRecipes.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          size="sm"
          className="justify-between"
        >
          {value ? semiFinishedRecipes.find(recipe => recipe.id === value)?.name : "Добавить из полуфабриката"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72">
        <Command>
          <CommandInput placeholder="Поиск полуфабрикатов..." className="h-9" />
          <CommandEmpty>Полуфабрикаты не найдены</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {semiFinishedRecipes.map((recipe) => (
              <CommandItem
                key={recipe.id}
                value={recipe.id}
                onSelect={() => {
                  setValue(recipe.id);
                  setOpen(false);
                  onSelectRecipe(recipe);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === recipe.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {recipe.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SemiFinishedDropdown;
