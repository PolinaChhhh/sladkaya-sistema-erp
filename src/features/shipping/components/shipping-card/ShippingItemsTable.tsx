
import React from 'react';
import ShippingItemRow from './ShippingItemRow';
import { calculateTotalAmount, calculateVatAmount } from '../../hooks/useShippingUtils';
import { ShippingDocument } from '@/store/recipeStore';

interface ShippingItemsTableProps {
  shipping: ShippingDocument;
  productions: any[];
  recipes: any[];
}

const ShippingItemsTable: React.FC<ShippingItemsTableProps> = ({
  shipping,
  productions,
  recipes
}) => {
  // Calculate total and VAT amounts
  const totalWithoutVat = shipping.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vatAmount = calculateVatAmount(shipping.items);
  const totalWithVat = calculateTotalAmount(shipping.items);

  return (
    <div className="bg-white/70 rounded-lg border border-blue-200 overflow-hidden">
      <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 text-sm font-medium text-gray-600">
        <div className="col-span-2">Товар</div>
        <div className="text-center">Количество</div>
        <div className="text-center">Цена (без НДС)</div>
        <div className="text-center">НДС %</div>
        <div className="text-center">Цена (с НДС)</div>
        <div className="text-right">Сумма</div>
      </div>
      
      {shipping.items.map((item, idx) => (
        <ShippingItemRow 
          key={idx} 
          item={item} 
          productions={productions} 
          recipes={recipes} 
        />
      ))}
      
      <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
        <div className="col-span-6 text-right font-medium">Сумма без НДС:</div>
        <div className="text-right font-medium">{totalWithoutVat.toFixed(2)} ₽</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
        <div className="col-span-6 text-right font-medium">НДС:</div>
        <div className="text-right font-medium">{vatAmount.toFixed(2)} ₽</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 p-3 bg-blue-50 border-t border-blue-100">
        <div className="col-span-6 text-right font-medium">Итого с НДС:</div>
        <div className="text-right font-bold">{totalWithVat.toFixed(2)} ₽</div>
      </div>
    </div>
  );
};

export default ShippingItemsTable;
