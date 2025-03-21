
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BuyerListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddBuyer: () => void;
}

const BuyerListHeader: React.FC<BuyerListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onAddBuyer
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Поиск клиентов..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddBuyer} className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        Добавить клиента
      </Button>
    </div>
  );
};

export default BuyerListHeader;
