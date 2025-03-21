
import { useMemo } from 'react';
import { ProductionBatch, Recipe } from '@/store/types';

export const useProductionFilters = (
  productions: ProductionBatch[],
  recipes: Recipe[],
  searchQuery: string
) => {
  // Filter productions based on search query
  const filteredProductions = useMemo(() => {
    return productions.filter(production => {
      const recipe = recipes.find(r => r.id === production.recipeId);
      return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [productions, recipes, searchQuery]);
  
  // Sort productions by date (newest first)
  const sortedProductions = useMemo(() => {
    return [...filteredProductions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredProductions]);
  
  return {
    filteredProductions,
    sortedProductions
  };
};
