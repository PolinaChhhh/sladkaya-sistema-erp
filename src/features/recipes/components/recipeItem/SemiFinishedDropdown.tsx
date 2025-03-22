
import React, { useState, useRef, useEffect } from 'react';
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
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Focus the search input when the dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when dropdown closes
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
        {!open ? (
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            size="sm"
            className="justify-between gap-1"
            ref={buttonRef}
          >
            <Search className="h-4 w-4" />
            Добавить из полуфабриката
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <div className="min-w-[240px]">
            <Input
              ref={inputRef}
              className="h-9 border-dashed"
              placeholder="Поиск полуфабрикатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                }
              }}
            />
          </div>
        )}
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
