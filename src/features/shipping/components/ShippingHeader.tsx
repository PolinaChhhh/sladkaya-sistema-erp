
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
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-64">
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
        className="bg-blue-600 hover:bg-blue-700"
        disabled={!canCreateShipment}
      >
        <Plus className="h-4 w-4 mr-2" /> Создать отгрузку
      </Button>
    </div>
  );
};

export default ShippingHeader;
