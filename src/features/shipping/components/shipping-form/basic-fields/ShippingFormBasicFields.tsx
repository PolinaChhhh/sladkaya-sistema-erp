
import React from 'react';
import BuyerSelector from './BuyerSelector';
import DateSelector from './DateSelector';
import { ShippingFormBasicFieldsProps } from './types';

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
      <BuyerSelector 
        buyers={buyers}
        buyerId={formData.buyerId}
        onChange={onBuyerChange}
      />
      
      <DateSelector
        date={formData.date}
        onChange={onDateChange}
      />
    </div>
  );
};

export default ShippingFormBasicFields;
