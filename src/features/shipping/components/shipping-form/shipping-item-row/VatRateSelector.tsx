
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vatRateOptions } from '../../../hooks/useShippingForm';

interface VatRateSelectorProps {
  vatRate: number;
  index: number;
  onChange: (index: number, field: string, value: number) => void;
}

const VatRateSelector: React.FC<VatRateSelectorProps> = ({
  vatRate,
  index,
  onChange
}) => {
  return (
    <div className="col-span-1">
      <Select
        value={String(vatRate)}
        onValueChange={(value) => onChange(index, 'vatRate', Number(value))}
      >
        <SelectTrigger className="text-center">
          <SelectValue placeholder="НДС %" />
        </SelectTrigger>
        <SelectContent>
          {vatRateOptions.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VatRateSelector;
