
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ShippingFormHeaderProps {
  onAddItem: () => void;
}

const ShippingFormHeader: React.FC<ShippingFormHeaderProps> = ({ onAddItem }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-base font-medium">Товары для отгрузки</h3>
      <Button 
        onClick={onAddItem} 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700"
      >
        <PlusCircle className="h-4 w-4 mr-1" /> Добавить товар
      </Button>
    </div>
  );
};

export default ShippingFormHeader;
