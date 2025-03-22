
import React, { useState, useEffect } from 'react';
import { Recipe } from '@/store/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Package } from "lucide-react";
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
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  
  // Filter recipes based on search query whenever the query changes
  useEffect(() => {
    // Only filter if there's a search query, otherwise show empty results
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter recipes based on case-insensitive name match
    const filteredRecipes = semiFinishedRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    console.log(`Search query "${searchQuery}" returned ${filteredRecipes.length} results`);
    setSearchResults(filteredRecipes);
  }, [searchQuery, semiFinishedRecipes]);

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
      setSearchResults([]); // Clear search results
    }
  };

  const handlePopoverClose = () => {
    // Reset search when closing the popover
    setSearchQuery("");
    setSearchResults([]);
    setOpen(false);
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
        <PopoverContent className="p-3 w-[300px]" align="start">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск полуфабрикатов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
            
            {searchQuery.trim() !== "" && (
              <div className="max-h-[300px] overflow-y-auto mt-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => handleRecipeSelect(recipe)}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>{recipe.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {recipe.output} {recipe.outputUnit}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-sm text-gray-500">
                    Полуфабрикат не найден
                  </div>
                )}
              </div>
            )}
          </div>
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
