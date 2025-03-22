
import React from 'react';
import { calculatePriceWithVat } from '../../../hooks/useShipmentsList';

interface PriceWithVatDisplayProps {
  price: number;
  vatRate: number;
}

const PriceWithVatDisplay: React.FC<PriceWithVatDisplayProps> = ({
  price,
  vatRate
}) => {
  const priceWithVat = calculatePriceWithVat(price, vatRate);
  
  return (
    <div className="col-span-2">
      <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center font-medium">
        {priceWithVat.toFixed(2)} ₽
      </div>
    </div>
  );
};

export default PriceWithVatDisplay;
