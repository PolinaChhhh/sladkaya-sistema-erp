
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
  semiFinishedRecipes = [], // Default to empty array
  onAddItem,
  onSelectSemiFinished
}) => {
  // Make sure semiFinishedRecipes is always an array
  const recipes = Array.isArray(semiFinishedRecipes) ? semiFinishedRecipes : [];
  
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <Label className="min-w-[100px]">
        {category === 'finished' ? 'Ингредиенты' : 'Состав полуфабриката'}
      </Label>
      <div className="flex flex-1 flex-wrap gap-2 justify-end">
        {category === 'finished' && (
          <SemiFinishedDropdown 
            semiFinishedRecipes={recipes} 
            onSelectRecipe={onSelectSemiFinished} 
          />
        )}
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-3 w-3 mr-1" /> Добавить ингредиент
        </Button>
      </div>
    </div>
  );
};

export default RecipeItemsHeader;
