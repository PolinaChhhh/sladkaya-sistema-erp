
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipeOutputFieldsProps {
  output: number;
  outputUnit: string;
  onOutputChange: (value: number) => void;
  onOutputUnitChange: (value: string) => void;
}

const RecipeOutputFields: React.FC<RecipeOutputFieldsProps> = ({
  output,
  outputUnit,
  onOutputChange,
  onOutputUnitChange,
}) => {
  return (
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
  );
};

export default RecipeOutputFields;
