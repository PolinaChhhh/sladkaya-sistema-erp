
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface ProductionHeaderProps {
  onAddNew: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const ProductionHeader: React.FC<ProductionHeaderProps> = ({ 
  onAddNew, 
  onSearchChange,
  searchQuery 
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Производство</h1>
          <p className="text-gray-500">Учет произведенной продукции</p>
        </div>
        
        <Button 
          className="bg-mint-600 hover:bg-mint-700" 
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Добавить
        </Button>
      </div>
      
      <div className="mt-4 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Поиск по названию..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductionHeader;
