
import React from 'react';

const ShippingTableHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-2 p-3 bg-slate-100 text-xs font-medium text-gray-600 rounded-t-md border-b">
      <div className="col-span-3 pl-2">Товар</div>
      <div className="col-span-1 text-center">Доступно</div>
      <div className="col-span-1 text-center">Количество</div>
      <div className="col-span-2 text-center">Цена (без НДС)</div>
      <div className="col-span-1 text-center">НДС %</div>
      <div className="col-span-2 text-center">Цена (с НДС)</div>
      <div className="col-span-1 text-center">Сумма</div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default ShippingTableHeader;
