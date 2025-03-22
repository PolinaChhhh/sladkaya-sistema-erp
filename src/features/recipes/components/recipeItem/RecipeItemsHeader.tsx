
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
  onSelectSemiFinished: (recipe: Recipe, amount: number) => void;
}

const RecipeItemsHeader: React.FC<RecipeItemsHeaderProps> = ({
  category,
  semiFinishedRecipes = [],
  onAddItem,
  onSelectSemiFinished
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-between">
      <Label className="text-base font-medium">
        {category === 'finished' ? 'Ингредиенты' : 'Состав полуфабриката'}
      </Label>
      <div className="flex flex-wrap gap-2">
        {/* Only show semi-finished dropdown for finished recipes */}
        {category === 'finished' && semiFinishedRecipes.length > 0 && (
          <SemiFinishedDropdown 
            semiFinishedRecipes={semiFinishedRecipes} 
            onSelectRecipe={onSelectSemiFinished} 
          />
        )}
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-1" /> Добавить ингредиент
        </Button>
      </div>
    </div>
  );
};

export default RecipeItemsHeader;
