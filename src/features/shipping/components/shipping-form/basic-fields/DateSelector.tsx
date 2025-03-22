
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DateSelectorProps } from './types';

const DateSelector: React.FC<DateSelectorProps> = ({ 
  date,
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Дата</Label>
      <Input
        id="date"
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DateSelector;
