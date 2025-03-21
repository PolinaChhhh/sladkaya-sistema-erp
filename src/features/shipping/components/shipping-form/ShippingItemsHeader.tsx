
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShippingItemsHeaderProps {
  onAddItem: () => void;
}

const ShippingItemsHeader: React.FC<ShippingItemsHeaderProps> = ({ onAddItem }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium">Товары в отгрузке</h3>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onAddItem}
      >
        <Plus className="h-4 w-4 mr-1.5" /> Добавить товар
      </Button>
    </div>
  );
};

export default ShippingItemsHeader;
