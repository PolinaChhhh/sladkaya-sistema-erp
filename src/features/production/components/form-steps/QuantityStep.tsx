
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface QuantityStepProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  outputUnit: string;
}

const QuantityStep: React.FC<QuantityStepProps> = ({
  quantity,
  onQuantityChange,
  date,
  onDateChange,
  outputUnit,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="quantity">Количество</Label>
        <div className="flex">
          <Input
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity || ''}
            onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
          />
          <span className="ml-2 flex items-center text-sm">{outputUnit}</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="date">Дата производства</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default QuantityStep;
