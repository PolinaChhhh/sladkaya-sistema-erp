
import React from 'react';
import { getProductName, getProductUnit } from '../../utils/shippingUtils';

interface ShippingItemRowProps {
  item: {
    productionBatchId: string;
    quantity: number;
    price: number;
    vatRate: number;
  };
  productions: any[];
  recipes: any[];
}

const ShippingItemRow: React.FC<ShippingItemRowProps> = ({
  item,
  productions,
  recipes
}) => {
  const vatRate = item.vatRate || 0;
  const priceWithVat = item.price * (1 + vatRate / 100);
  const amount = item.quantity * priceWithVat;
  
  return (
    <div className="grid grid-cols-7 gap-2 p-3 text-sm border-t border-blue-100">
      <div className="col-span-2">{getProductName(productions, recipes, item.productionBatchId)}</div>
      <div className="text-center">{item.quantity} {getProductUnit(productions, recipes, item.productionBatchId)}</div>
      <div className="text-center">{item.price.toFixed(2)} ₽</div>
      <div className="text-center">{vatRate}%</div>
      <div className="text-center">{priceWithVat.toFixed(2)} ₽</div>
      <div className="text-right font-medium">{amount.toFixed(2)} ₽</div>
    </div>
  );
};

export default ShippingItemRow;
