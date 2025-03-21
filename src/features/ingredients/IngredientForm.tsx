
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
import { 
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormDescription,
  FormMessage 
} from '@/components/ui/form';

interface IngredientFormData {
  name: string;
  unit: string;
  cost: number;
  quantity: number;
  isSemiFinal: boolean;
  type: string;
  customType: string;
}

interface IngredientFormProps {
  title: string;
  formData: IngredientFormData;
  setFormData: (data: IngredientFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  ingredientTypes: string[];
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  title,
  formData,
  setFormData,
  onCancel,
  onSubmit,
  submitLabel,
  ingredientTypes
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

        <div className="grid gap-2">
          <Label htmlFor="ingredient-type">Тип ингредиента</Label>
          <Select 
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип ингредиента" />
            </SelectTrigger>
            <SelectContent>
              {ingredientTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              <SelectItem value="custom">Свой тип</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === 'custom' && (
          <div className="grid gap-2">
            <Label htmlFor="custom-type">Свой тип ингредиента</Label>
            <Input 
              id="custom-type" 
              value={formData.customType}
              onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
              placeholder="Введите свой тип ингредиента"
            />
          </div>
        )}
        
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
