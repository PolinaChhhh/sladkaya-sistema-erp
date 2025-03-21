
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/recipeStore';

interface ProductionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    recipeId: string;
    quantity: number;
    date: string;
    autoProduceSemiFinals: boolean;
  }>>;
  onSubmit: () => void;
  calculateCost: (recipeId: string, quantity: number) => number;
  getRecipeOutput: (recipeId: string) => string;
}

const ProductionDialog: React.FC<ProductionDialogProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  calculateCost,
  getRecipeOutput
}) => {
  const { recipes } = useStore();
  
  // Filter recipes to show by category
  const filteredRecipes = recipes.filter(recipe => 
    recipe.category === 'semi-finished' || recipe.category === 'finished'
  );

  // Get semi-finished and finished recipes
  const semiFinishedRecipes = filteredRecipes.filter(recipe => recipe.category === 'semi-finished');
  const finishedRecipes = filteredRecipes.filter(recipe => recipe.category === 'finished');

  // Check if the selected recipe is a finished product to show the auto-produce option
  const selectedRecipe = recipes.find(r => r.id === formData.recipeId);
  const isFinishedProduct = selectedRecipe?.category === 'finished';

  // Calculate the estimated cost
  const estimatedCost = (formData.recipeId && formData.quantity > 0) 
    ? calculateCost(formData.recipeId, formData.quantity) 
    : 0;

  // Calculate unit cost
  const unitCost = formData.quantity > 0 
    ? estimatedCost / formData.quantity 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить производство</DialogTitle>
          <DialogDescription>
            Создайте новую партию продукции для учета в системе
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipe">Рецепт</Label>
            <Select 
              value={formData.recipeId}
              onValueChange={(value) => setFormData({ ...formData, recipeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите рецепт" />
              </SelectTrigger>
              <SelectContent>
                {/* Use a placeholder with a non-empty value */}
                <SelectItem value="_placeholder" disabled>Выберите рецепт</SelectItem>
                
                {/* Only show category headers if there are recipes in that category */}
                {semiFinishedRecipes.length > 0 && (
                  <SelectItem value="_semi_header" disabled className="font-semibold text-sm text-gray-500">
                    -- Полуфабрикаты --
                  </SelectItem>
                )}
                
                {semiFinishedRecipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
                
                {finishedRecipes.length > 0 && (
                  <SelectItem value="_finished_header" disabled className="font-semibold text-sm text-gray-500">
                    -- Готовые изделия --
                  </SelectItem>
                )}
                
                {finishedRecipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="quantity">Количество</Label>
            <Input 
              id="quantity" 
              type="number"
              min="0.1"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
            />
            {formData.recipeId && formData.recipeId !== '_placeholder' && formData.recipeId !== '_semi_header' && formData.recipeId !== '_finished_header' && (
              <p className="text-xs text-gray-500">
                Единица измерения: {getRecipeOutput(formData.recipeId)}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Дата производства</Label>
            <Input 
              id="date" 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          {/* Auto-produce toggle for finished products */}
          {isFinishedProduct && (
            <div className="flex items-center space-x-2 mt-2">
              <Switch 
                id="auto-produce"
                checked={formData.autoProduceSemiFinals}
                onCheckedChange={(checked) => setFormData({ ...formData, autoProduceSemiFinals: checked })}
              />
              <Label htmlFor="auto-produce">Автоматически производить необходимые полуфабрикаты</Label>
            </div>
          )}
          
          {formData.recipeId && formData.recipeId !== '_placeholder' && formData.recipeId !== '_semi_header' && formData.recipeId !== '_finished_header' && (
            <div className="mt-2 p-3 bg-mint-50 rounded-md border border-mint-200">
              <div className="flex items-center text-sm font-medium text-mint-800 mb-1">
                <Info className="h-4 w-4 mr-1.5" />
                Расчет себестоимости
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Общая себестоимость: <span className="font-medium">{estimatedCost.toFixed(2)} ₽</span>
              </p>
              <p className="text-sm text-gray-600">
                Себестоимость за единицу: <span className="font-medium">
                  {unitCost.toFixed(2)} ₽/{getRecipeOutput(formData.recipeId)}
                </span>
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button className="bg-mint-600 hover:bg-mint-700" onClick={onSubmit}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionDialog;
