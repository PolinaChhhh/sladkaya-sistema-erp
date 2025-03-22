
import React from 'react';
import { calculatePriceWithVat } from '../../../hooks/useShipmentsList';

interface AmountDisplayProps {
  quantity: number;
  price: number;
  vatRate: number;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({
  quantity,
  price,
  vatRate
}) => {
  const priceWithVat = calculatePriceWithVat(price, vatRate);
  const amount = quantity * priceWithVat;
  
  return (
    <div className="col-span-1">
      <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center font-medium">
        {amount.toFixed(2)} ₽
      </div>
    </div>
  );
};

export default AmountDisplay;
