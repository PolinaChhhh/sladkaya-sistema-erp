
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCategory, RecipeItem } from '@/store/types';

interface RecipeOutputFieldsProps {
  output: number;
  outputUnit: string;
  category: RecipeCategory;
  items: RecipeItem[];
  lossPercentage?: number;
  onOutputChange: (value: number) => void;
  onOutputUnitChange: (value: string) => void;
  onCategoryChange?: (value: RecipeCategory) => void;
  onLossPercentageChange?: (value: number) => void;
  getIngredientUnit?: (id: string) => string;
}

const RecipeOutputFields: React.FC<RecipeOutputFieldsProps> = ({
  output,
  outputUnit,
  category,
  items,
  lossPercentage,
  onOutputChange,
  onOutputUnitChange,
  onCategoryChange,
  onLossPercentageChange,
  getIngredientUnit
}) => {
  // Calculate total input weight
  const calculateTotalInput = (): number => {
    if (!items || !getIngredientUnit) return 0;
    
    return items.reduce((total, item) => {
      if (item.ingredientId && getIngredientUnit(item.ingredientId) === outputUnit) {
        return total + item.amount;
      }
      return total;
    }, 0);
  };

  // Calculate loss percentage automatically
  useEffect(() => {
    if (category === 'semi-finished' && onLossPercentageChange) {
      const totalInput = calculateTotalInput();
      if (totalInput > 0 && output > 0) {
        const calculatedLoss = ((totalInput - output) / totalInput) * 100;
        // Only update if the difference is significant (more than 0.1%)
        if (Math.abs((calculatedLoss || 0) - (lossPercentage || 0)) > 0.1) {
          onLossPercentageChange(Math.max(0, parseFloat(calculatedLoss.toFixed(2))));
        }
      }
    }
  }, [items, output, category, onLossPercentageChange, lossPercentage]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="output">Выход</Label>
          <Input 
            id="output" 
            type="number"
            min="0.1"
            step="0.1"
            value={output}
            onChange={(e) => onOutputChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="outputUnit">Единица измерения</Label>
          <Select 
            value={outputUnit}
            onValueChange={onOutputUnitChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите единицу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="г">г</SelectItem>
              <SelectItem value="кг">кг</SelectItem>
              <SelectItem value="мл">мл</SelectItem>
              <SelectItem value="л">л</SelectItem>
              <SelectItem value="шт">шт</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {category === 'semi-finished' && lossPercentage !== undefined && (
        <div className="grid gap-2">
          <Label htmlFor="lossPercentage">Процент потерь (рассчитывается автоматически)</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="lossPercentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={lossPercentage}
              disabled
              className="bg-gray-50"
            />
            <span className="text-sm">%</span>
          </div>
        </div>
      )}

      {onCategoryChange && (
        <div className="grid gap-2">
          <Label htmlFor="category">Тип продукта</Label>
          <Select
            value={category}
            onValueChange={(value) => onCategoryChange(value as RecipeCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finished">Готовый продукт</SelectItem>
              <SelectItem value="semi-finished">Полуфабрикат</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RecipeOutputFields;
