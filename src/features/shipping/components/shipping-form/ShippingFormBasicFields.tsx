
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingFormBasicFieldsProps {
  buyers: any[];
  formData: {
    buyerId: string;
    date: string;
    items: any[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    buyerId: string;
    date: string;
    items: any[];
  }>>;
}

const ShippingFormBasicFields: React.FC<ShippingFormBasicFieldsProps> = ({
  buyers,
  formData,
  setFormData
}) => {
  const onBuyerChange = (value: string) => {
    setFormData(prev => ({ ...prev, buyerId: value }));
  };

  const onDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, date: value }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="buyer">Клиент</Label>
        <Select 
          value={formData.buyerId} 
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
          value={formData.date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ShippingFormBasicFields;
