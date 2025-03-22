
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuyerSelectorProps } from './types';

const BuyerSelector: React.FC<BuyerSelectorProps> = ({ 
  buyers, 
  buyerId,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="buyer">Клиент</Label>
      <Select 
        value={buyerId} 
        onValueChange={onChange}
      >
        <SelectTrigger id="buyer">
          <SelectValue placeholder="Выберите клиента" />
        </SelectTrigger>
        <SelectContent>
          {buyers.map((buyer) => (
            <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BuyerSelector;
