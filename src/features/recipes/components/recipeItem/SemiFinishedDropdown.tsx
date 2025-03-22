
import React, { useState, useEffect } from 'react';
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
import { Check, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from 'sonner';

interface SemiFinishedDropdownProps {
  semiFinishedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe, amount: number) => void;
}

const SemiFinishedDropdown: React.FC<SemiFinishedDropdownProps> = ({ 
  semiFinishedRecipes = [], 
  onSelectRecipe 
}) => {
  const [open, setOpen] = useState(false);
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
    setAmountDialogOpen(true);
  };

  const handleAmountConfirm = () => {
    if (selectedRecipe) {
      if (amount <= 0) {
        toast.error('Укажите количество больше нуля');
        return;
      }
      
      console.log(`Adding ${selectedRecipe.name}: ${amount}g`);
      onSelectRecipe(selectedRecipe, amount);
      setAmountDialogOpen(false);
      setAmount(100); // Reset to default
      setSelectedRecipe(null);
      setSearchQuery(""); // Clear search query
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Добавить полуфабрикат</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput 
              placeholder="Поиск полуфабрикатов..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              autoFocus
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>Полуфабрикаты не найдены</CommandEmpty>
              <CommandGroup>
                {filteredRecipes.map((recipe) => (
                  <CommandItem
                    key={recipe.id}
                    value={recipe.id}
                    onSelect={() => handleRecipeSelect(recipe)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{recipe.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {recipe.output} {recipe.outputUnit}
                    </span>
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
              Система автоматически разложит полуфабрикат на ингредиенты.
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
              
              {selectedRecipe && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                  <p>Будут добавлены все ингредиенты из "{selectedRecipe.name}" с учетом указанного количества.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAmountDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAmountConfirm}>
              Добавить ингредиенты
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SemiFinishedDropdown;
