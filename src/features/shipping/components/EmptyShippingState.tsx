
import React from 'react';
import { Truck } from 'lucide-react';

const EmptyShippingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-1">Нет данных об отгрузках</h3>
      <p className="text-gray-500">Создайте первую отгрузку, нажав кнопку выше</p>
    </div>
  );
};

export default EmptyShippingState;
