
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCategory } from '@/store/types';

interface RecipeOutputFieldsProps {
  output: number;
  outputUnit: string;
  calculatedLossPercentage: number;
  totalIngredientsWeight: number;
  category: RecipeCategory;
  onOutputChange: (value: number) => void;
  onOutputUnitChange: (value: string) => void;
}

const RecipeOutputFields: React.FC<RecipeOutputFieldsProps> = ({
  output,
  outputUnit,
  calculatedLossPercentage,
  totalIngredientsWeight,
  category,
  onOutputChange,
  onOutputUnitChange,
}) => {
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
            onValueChange={(value) => onOutputUnitChange(value)}
            disabled={true} // Unit is now automatically set based on category
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите единицу" />
            </SelectTrigger>
            <SelectContent>
              {category === 'semi-finished' ? (
                <SelectItem value="кг">кг</SelectItem>
              ) : (
                <SelectItem value="шт">шт</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Вес всех ингредиентов</Label>
          <div className="h-10 px-3 py-2 border rounded-md flex items-center text-sm">
            {totalIngredientsWeight.toFixed(2)} кг
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Процент потерь (расчетный)</Label>
          <div className={`h-10 px-3 py-2 border rounded-md flex items-center text-sm ${calculatedLossPercentage > 0 ? 'text-amber-600' : calculatedLossPercentage < 0 ? 'text-red-600' : ''}`}>
            {calculatedLossPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeOutputFields;
