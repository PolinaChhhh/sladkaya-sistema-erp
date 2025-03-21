
import { useState, useMemo } from 'react';
import { ProductionBatch, Recipe } from '@/store/types';

export const useProductionFilter = (
  productions: ProductionBatch[],
  recipes: Recipe[]
) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter productions by search query
  const filteredProductions = useMemo(() => {
    return productions
      .filter(production => {
        if (!searchQuery.trim()) return true;
        
        const recipe = recipes.find(r => r.id === production.recipeId);
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
