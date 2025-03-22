
import React from 'react';
import { Input } from '@/components/ui/input';

interface PriceInputProps {
  price: number;
  index: number;
  onChange: (index: number, field: string, value: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({
  price,
  index,
  onChange
}) => {
  return (
    <div className="col-span-2">
      <Input
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => onChange(index, 'price', Number(e.target.value))}
        className="text-center"
      />
    </div>
  );
};

export default PriceInput;
