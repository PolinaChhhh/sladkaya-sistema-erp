
import React from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface IngredientFormData {
  name: string;
  unit: string;
  cost: number;
  quantity: number;
  isSemiFinal: boolean;
}

interface IngredientFormProps {
  title: string;
  formData: IngredientFormData;
  setFormData: (data: IngredientFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  title,
  formData,
  setFormData,
  onCancel,
  onSubmit,
  submitLabel
}) => {
  return (
    <DialogContent className="sm:max-w-md">
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
            placeholder="Введите название ингредиента"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="type-switch"
            checked={formData.isSemiFinal}
            onCheckedChange={(checked) => setFormData({ ...formData, isSemiFinal: checked })}
          />
          <Label htmlFor="type-switch">Полуфабрикат</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cost">Стоимость (₽)</Label>
            <Input 
              id="cost" 
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit">Единица измерения</Label>
            <Select 
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите единицу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="кг">кг</SelectItem>
                <SelectItem value="л">л</SelectItem>
                <SelectItem value="шт">шт</SelectItem>
                <SelectItem value="г">г</SelectItem>
                <SelectItem value="мл">мл</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="quantity">Текущий остаток</Label>
          <Input 
            id="quantity" 
            type="number"
            min="0"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button className="bg-cream-600 hover:bg-cream-700" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default IngredientForm;
