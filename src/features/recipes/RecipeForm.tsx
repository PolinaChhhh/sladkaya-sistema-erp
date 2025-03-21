
import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ingredient, RecipeItem } from '@/store/recipeStore';
import { toast } from 'sonner';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: {
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    output: number;
    outputUnit: string;
    items: RecipeItem[];
  }>>;
  onSubmit: () => void;
  ingredients: Ingredient[];
  getIngredientName: (id: string) => string;
  getIngredientUnit: (id: string) => string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  isOpen,
  onClose,
  title,
  formData,
  setFormData,
  onSubmit,
  ingredients,
  getIngredientName,
  getIngredientUnit,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  
  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast.error('Сначала добавьте ингредиенты');
      return;
    }
    
    const firstIngredient = ingredients[0];
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ingredientId: firstIngredient.id, amount: 0 }],
    }));
  };
  
  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };
  
  const removeRecipeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const filterIngredients = (value: string) => {
    return ingredients.filter((ingredient) => 
      ingredient.name.toLowerCase().includes(value.toLowerCase())
    );
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Название</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Введите название рецепта"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea 
            id="description" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание рецепта (опционально)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="output">Выход</Label>
            <Input 
              id="output" 
              type="number"
              min="0.1"
              step="0.1"
              value={formData.output}
              onChange={(e) => setFormData({ ...formData, output: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outputUnit">Единица измерения</Label>
            <Select 
              value={formData.outputUnit}
              onValueChange={(value) => setFormData({ ...formData, outputUnit: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите единицу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="кг">кг</SelectItem>
                <SelectItem value="л">л</SelectItem>
                <SelectItem value="шт">шт</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3 mt-2">
          <div className="flex justify-between items-center">
            <Label>Ингредиенты</Label>
            <Button type="button" variant="outline" size="sm" onClick={addRecipeItem}>
              <Plus className="h-3 w-3 mr-1" /> Добавить
            </Button>
          </div>
          
          {formData.items.length > 0 ? (
            <div className="space-y-3 mt-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <Popover open={open === index} onOpenChange={(isOpen) => setOpen(isOpen ? index : null)}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        role="combobox" 
                        aria-expanded={open === index} 
                        className="flex-1 justify-between">
                        {item.ingredientId ? getIngredientName(item.ingredientId) : "Выберите ингредиент"}
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
                        />
                        <CommandEmpty>Ингредиенты не найдены.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {filterIngredients(searchValue).map((ingredient) => (
                            <CommandItem
                              key={ingredient.id}
                              value={ingredient.name}
                              onSelect={() => {
                                updateRecipeItem(index, 'ingredientId', ingredient.id);
                                setSearchValue("");
                                setOpen(null);
                              }}
                            >
                              {ingredient.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="w-24"
                      value={item.amount}
                      onChange={(e) => updateRecipeItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-sm text-gray-500">
                      {getIngredientUnit(item.ingredientId)}
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeRecipeItem(index)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">Нет добавленных ингредиентов</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button className="bg-confection-600 hover:bg-confection-700" onClick={onSubmit}>
          {title === "Создать новый рецепт" ? "Создать рецепт" : "Сохранить изменения"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RecipeForm;
