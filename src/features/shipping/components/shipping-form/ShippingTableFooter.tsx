
import React from 'react';
import { calculateTotalAmount, calculateVatAmount } from '../../hooks/useShipmentsList';

interface ShippingTableFooterProps {
  items: {
    productionBatchId: string;
    quantity: number;
    price: number;
    vatRate: number;
  }[];
}

const ShippingTableFooter: React.FC<ShippingTableFooterProps> = ({ items }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 border-t text-sm">
        <div className="col-span-9 text-right font-medium">Сумма без НДС:</div>
        <div className="col-span-2 text-right font-medium">
          {items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)} ₽
        </div>
        <div className="col-span-1"></div>
      </div>
      
      <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 border-t text-sm">
        <div className="col-span-9 text-right font-medium">НДС:</div>
        <div className="col-span-2 text-right font-medium">
          {calculateVatAmount(items).toFixed(2)} ₽
        </div>
        <div className="col-span-1"></div>
      </div>
      
      <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 border-t text-sm">
        <div className="col-span-9 text-right font-medium">Итого с НДС:</div>
        <div className="col-span-2 text-right font-bold">
          {calculateTotalAmount(items).toFixed(2)} ₽
        </div>
        <div className="col-span-1"></div>
      </div>
    </>
  );
};

export default ShippingTableFooter;
