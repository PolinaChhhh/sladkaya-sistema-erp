
import React from 'react';

const ShippingTableHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-16 gap-2 p-3 bg-blue-50 text-xs font-medium text-gray-600">
      <div className="col-span-3">Товар</div>
      <div className="col-span-2 text-center">В наличии</div>
      <div className="col-span-2 text-center">Количество</div>
      <div className="col-span-2 text-center">Цена (без НДС)</div>
      <div className="col-span-2 text-center">НДС %</div>
      <div className="col-span-2 text-center">Цена (с НДС)</div>
      <div className="col-span-2 text-right">Сумма</div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default ShippingTableHeader;
