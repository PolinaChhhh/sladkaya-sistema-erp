
import React from 'react';
import { ChefHat, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/store/types';

interface ChefCardHeaderProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
}

const ChefCardHeader: React.FC<ChefCardHeaderProps> = ({ recipe, onEdit }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-confection-100 p-2 rounded-full">
          <ChefHat className="h-6 w-6 text-confection-600" />
        </div>
        <div>
          <h1 className="text-3xl font-playfair text-gray-800 font-bold">{recipe.name}</h1>
          <Badge variant="outline" className="bg-white/80 text-xs font-normal mt-1">
            {recipe.category === 'finished' ? 'Готовая продукция' : 'Полуфабрикат'}
          </Badge>
        </div>
      </div>
      
      {onEdit && (
        <Button 
          onClick={() => onEdit(recipe)} 
          variant="outline" 
          size="sm"
        >
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      )}
    </div>
  );
};

export default ChefCardHeader;
