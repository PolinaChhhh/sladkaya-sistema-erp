
import React from 'react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/store/types';

interface SemiFinishedDropdownProps {
  semiFinishedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const SemiFinishedDropdown: React.FC<SemiFinishedDropdownProps> = ({ 
  semiFinishedRecipes, 
  onSelectRecipe 
}) => {
  if (semiFinishedRecipes.length === 0) {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="dropdown-toggle" 
        onClick={() => {}}
      >
        Добавить из полуфабриката
      </Button>
      <ul className="dropdown-menu z-10 bg-white border rounded-md shadow-lg p-2 mt-1 max-h-60 overflow-auto">
        {semiFinishedRecipes.map((recipe) => (
          <li key={recipe.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectRecipe(recipe)}
          >
            {recipe.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SemiFinishedDropdown;
