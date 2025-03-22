
import React, { useState, useRef, useEffect } from 'react';
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
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when mounted
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  // Clear search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Filter recipes based on search query
  const filteredRecipes = semiFinishedRecipes 
    ? semiFinishedRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  if (!semiFinishedRecipes || semiFinishedRecipes.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-[240px]">
          <Input
            ref={inputRef}
            placeholder="Поиск полуфабрикатов..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpen(true); // Open popover when typing
            }}
            onFocus={() => setOpen(true)}
            className="h-9 pr-8"
          />
          <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[240px]" align="start">
        <Command>
          <CommandInput 
            placeholder="Поиск полуфабрикатов..." 
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>Полуфабрикаты не найдены</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {filteredRecipes.map((recipe) => (
              <CommandItem
                key={recipe.id}
                value={recipe.id}
                onSelect={() => {
                  setValue(recipe.id);
                  setOpen(false);
                  onSelectRecipe(recipe);
                  setSearchQuery(""); // Clear search after selection
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
