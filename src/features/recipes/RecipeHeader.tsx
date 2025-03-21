
import React from 'react';
import { ChefHat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeHeaderProps {
  onAddNew: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <div className="p-2 bg-confection-100 rounded-full mr-3">
          <ChefHat className="h-5 w-5 text-confection-700" />
        </div>
        <h1 className="text-2xl font-semibold">Рецепты</h1>
      </div>
      <Button onClick={onAddNew} className="bg-confection-600 hover:bg-confection-700">
        <Plus className="h-4 w-4 mr-2" /> Создать рецепт
      </Button>
    </div>
  );
};

export default RecipeHeader;
