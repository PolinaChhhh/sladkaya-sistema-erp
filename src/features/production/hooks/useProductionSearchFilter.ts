
import { useState, useMemo } from 'react';
import { ProductionBatch } from '@/store/types';

export const useProductionSearchFilter = (
  productions: ProductionBatch[],
  recipes: any[]
) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort productions
  const filteredProductions = useMemo(() => {
    return productions
      .filter(p => {
        if (!searchQuery) return true;
        
        const recipe = recipes.find(r => r.id === p.recipeId);
        if (!recipe) return false;
        
        return recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [productions, recipes, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProductions
  };
};
