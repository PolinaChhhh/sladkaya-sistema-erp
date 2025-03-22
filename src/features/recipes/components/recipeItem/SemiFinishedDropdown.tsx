
import React, { useState, useRef } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

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
  
  // Create a safe reference to semiFinishedRecipes
  const recipes = Array.isArray(semiFinishedRecipes) ? semiFinishedRecipes : [];
  
  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipeSelect = (recipe: Recipe) => {
    console.log("Selected recipe:", recipe.name);
    setSelectedRecipe(recipe);
    setOpen(false);
    setSearchQuery("");
    setAmountDialogOpen(true); // This opens the amount dialog
  };

  const handleAmountConfirm = () => {
    if (selectedRecipe) {
      console.log(`Confirming amount: ${amount}g for ${selectedRecipe.name}`);
      onSelectRecipe(selectedRecipe, amount);
      setAmountDialogOpen(false);
      setAmount(100); // Reset to default
      setSelectedRecipe(null);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative w-[240px] justify-start">
            <Search className="mr-2 h-4 w-4" />
            {searchQuery ? searchQuery : "Поиск полуфабрикатов..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[240px]" align="start">
          <Command>
            <CommandInput 
              placeholder="Поиск полуфабрикатов..." 
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

      {/* Amount Selection Dialog */}
      <Dialog open={amountDialogOpen} onOpenChange={setAmountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe ? `Укажите количество "${selectedRecipe.name}"` : 'Укажите количество'}
            </DialogTitle>
            <DialogDescription>
              Укажите нужное количество полуфабриката для добавления в рецепт.
            </DialogDescription>
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
