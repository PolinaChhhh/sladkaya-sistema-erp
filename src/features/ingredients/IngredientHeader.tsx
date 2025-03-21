
import React from 'react';
import { Box, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IngredientHeaderProps {
  onAddNew: () => void;
}

const IngredientHeader: React.FC<IngredientHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <div className="p-2 bg-cream-100 rounded-full mr-3">
          <Box className="h-5 w-5 text-cream-700" />
        </div>
        <h1 className="text-2xl font-semibold">Ингредиенты</h1>
      </div>
      <Button onClick={onAddNew} className="bg-cream-600 hover:bg-cream-700">
        <Plus className="h-4 w-4 mr-2" /> Добавить ингредиент
      </Button>
    </div>
  );
};

export default IngredientHeader;
