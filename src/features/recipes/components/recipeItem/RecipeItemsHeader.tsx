
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RecipeCategory, Recipe } from '@/store/types';
import SemiFinishedDropdown from './SemiFinishedDropdown';

interface RecipeItemsHeaderProps {
  category: RecipeCategory;
  semiFinishedRecipes: Recipe[];
  onAddItem: () => void;
  onSelectSemiFinished: (recipe: Recipe) => void;
}

const RecipeItemsHeader: React.FC<RecipeItemsHeaderProps> = ({
  category,
  semiFinishedRecipes,
  onAddItem,
  onSelectSemiFinished
}) => {
  return (
    <div className="flex justify-between items-center">
      <Label>
        {category === 'finished' ? 'Ингредиенты' : 'Состав полуфабриката'}
      </Label>
      <div className="flex gap-2">
        {category === 'finished' && semiFinishedRecipes.length > 0 && (
          <SemiFinishedDropdown 
            semiFinishedRecipes={semiFinishedRecipes} 
            onSelectRecipe={onSelectSemiFinished} 
          />
        )}
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-3 w-3 mr-1" /> Добавить
        </Button>
      </div>
    </div>
  );
};

export default RecipeItemsHeader;
