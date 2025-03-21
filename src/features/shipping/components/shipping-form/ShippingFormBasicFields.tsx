
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingFormBasicFieldsProps {
  buyerId: string;
  date: string;
  buyers: any[];
  onBuyerChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const ShippingFormBasicFields: React.FC<ShippingFormBasicFieldsProps> = ({
  buyerId,
  date,
  buyers,
  onBuyerChange,
  onDateChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="buyer">Клиент</Label>
        <Select 
          value={buyerId} 
          onValueChange={onBuyerChange}
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
      
      <div className="space-y-2">
        <Label htmlFor="date">Дата</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ShippingFormBasicFields;
