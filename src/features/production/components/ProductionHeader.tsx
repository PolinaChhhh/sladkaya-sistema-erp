
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';

interface ProductionHeaderProps {
  onAddNew: () => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
}

const ProductionHeader: React.FC<ProductionHeaderProps> = ({
  onAddNew,
  onSearchChange,
  searchQuery
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Производство</h1>
        <Button onClick={onAddNew} className="bg-cream-600 hover:bg-cream-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Добавить производство
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Поиск производства..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductionHeader;
