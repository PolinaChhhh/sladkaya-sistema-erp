
import React, { useState, useRef, useEffect } from 'react';
import { Recipe } from '@/store/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface SemiFinishedDropdownProps {
  semiFinishedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe, amount: number) => void;
}

const SemiFinishedDropdown: React.FC<SemiFinishedDropdownProps> = ({ 
  semiFinishedRecipes = [], // Default to empty array
  onSelectRecipe 
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [amount, setAmount] = useState(100); // Default amount in grams
  
  // Filter recipes based on search query
  const filteredRecipes = Array.isArray(semiFinishedRecipes) 
    ? semiFinishedRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setOpen(false);
    setSearchQuery("");
    setAmountDialogOpen(true);
  };

  const handleAmountConfirm = () => {
    if (selectedRecipe) {
      onSelectRecipe(selectedRecipe, amount);
      setAmountDialogOpen(false);
      setAmount(100); // Reset to default
    }
  };

  return (
    <>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Поиск полуфабрикатов..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>

        {open && filteredRecipes.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="hidden" />
            <PopoverContent className="p-0 w-[240px]" align="start">
              <Command>
                <CommandInput 
                  placeholder="Поиск полуфабрикатов..." 
                  className="h-9"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Полуфабрикаты не найдены</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {filteredRecipes.map((recipe) => (
                      <CommandItem
                        key={recipe.id}
                        value={recipe.id}
                        onSelect={() => handleRecipeSelect(recipe)}
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
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Amount Selection Dialog */}
      <Dialog open={amountDialogOpen} onOpenChange={setAmountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe ? `Укажите количество "${selectedRecipe.name}"` : 'Укажите количество'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Количество (гр):</span>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-24" 
                />
              </div>
              <Slider 
                value={[amount]} 
                min={10} 
                max={1000} 
                step={10}
                onValueChange={(value) => setAmount(value[0])} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAmountDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAmountConfirm}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SemiFinishedDropdown;
