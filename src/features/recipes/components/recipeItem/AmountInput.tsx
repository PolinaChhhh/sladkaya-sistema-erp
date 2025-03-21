
import React from 'react';
import { Input } from '@/components/ui/input';

interface AmountInputProps {
  amount: number;
  unit: string;
  onAmountChange: (amount: number) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, unit, onAmountChange }) => {
  return (
    <div className="flex items-center gap-1 min-w-[120px]">
      <Input 
        type="number"
        min="0.01"
        step="0.01"
        className="w-20"
        value={amount || ''}
        onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
        placeholder="Кол-во"
      />
      
      <span className="text-sm text-gray-500 w-8">
        {unit}
      </span>
    </div>
  );
};

export default AmountInput;
