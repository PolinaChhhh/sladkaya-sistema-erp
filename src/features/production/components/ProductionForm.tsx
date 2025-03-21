
import React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Recipe } from '@/store/recipeStore';
import { ProductionFormData } from '../hooks/useProductionPage';

interface ProductionFormProps {
  title: string;
  recipes: Recipe[];
  formData: ProductionFormData;
  onFormDataChange: (data: Partial<ProductionFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProductionForm: React.FC<ProductionFormProps> = ({
  title,
  recipes,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  // Find the selected recipe to get its unit
  const selectedRecipe = recipes.find(r => r.id === formData.recipeId);
  const outputUnit = selectedRecipe ? selectedRecipe.outputUnit : '';
  
  // Filtered recipes - only show finished products
  const finishedRecipes = recipes.filter(r => r.category === 'finished');
  
  // Check if the selected recipe has semi-finals
  const hasSemiFinals = selectedRecipe ? 
    selectedRecipe.items.some(item => item.type === 'recipe' && item.recipeId) : 
    false;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="recipe">Продукт</Label>
            <Select
              value={formData.recipeId}
              onValueChange={(value) => onFormDataChange({ recipeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите продукт" />
              </SelectTrigger>
              <SelectContent>
                {finishedRecipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Количество</Label>
            <div className="flex">
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => onFormDataChange({ quantity: parseFloat(e.target.value) || 0 })}
              />
              <span className="ml-2 flex items-center text-sm">{outputUnit}</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="date">Дата производства</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFormDataChange({ date: e.target.value })}
            />
          </div>
          
          {hasSemiFinals && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-produce"
                checked={formData.autoProduceSemiFinals}
                onCheckedChange={(checked) => 
                  onFormDataChange({ autoProduceSemiFinals: checked as boolean })
                }
              />
              <Label htmlFor="auto-produce" className="text-sm font-normal">
                Автоматически произвести полуфабрикаты
              </Label>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-cream-600 hover:bg-cream-700">
            Сохранить
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ProductionForm;
