
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface SupplierListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddSupplier: () => void;
}

const SupplierListHeader: React.FC<SupplierListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onAddSupplier
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Поиск поставщиков..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddSupplier} className="bg-cream-600 hover:bg-cream-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        Добавить поставщика
      </Button>
    </div>
  );
};

export default SupplierListHeader;
