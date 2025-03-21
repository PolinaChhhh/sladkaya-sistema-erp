
import React from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductionHeaderProps {
  onAddNew: () => void;
}

const ProductionHeader: React.FC<ProductionHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <div className="p-2 bg-mint-100 rounded-full mr-3">
          <TrendingUp className="h-5 w-5 text-mint-700" />
        </div>
        <h1 className="text-2xl font-semibold">Производство</h1>
      </div>
      <Button onClick={onAddNew} className="bg-mint-600 hover:bg-mint-700">
        <Plus className="h-4 w-4 mr-2" /> Добавить производство
      </Button>
    </div>
  );
};

export default ProductionHeader;
