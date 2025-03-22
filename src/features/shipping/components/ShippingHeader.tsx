
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ShippingHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  canCreateShipment: boolean;
}

const ShippingHeader: React.FC<ShippingHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateClick,
  canCreateShipment
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Поиск по клиентам..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        onClick={onCreateClick} 
        className="w-full sm:w-auto"
        disabled={!canCreateShipment}
      >
        <Plus className="h-4 w-4 mr-2" /> Создать отгрузку
      </Button>
    </div>
  );
};

export default ShippingHeader;
