
import { useStore } from '@/store/recipeStore';
import { useMemo, useState, useEffect } from 'react';
import { ProfitabilityData } from '../types/reports';
import { calculateProfitabilityData } from '../utils/profitabilityUtils';
import { calculateDailyCosts } from '../utils/costAnalysisUtils';

export const useProductProfitability = () => {
  const { shippings, productions, recipes } = useStore();
  
  // Current date for default filter
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Filters state
  const [selectedMonth, setSelectedMonth] = useState<Date>(firstDayOfMonth);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate date filter string based on selected month (YYYY-MM format)
  const dateFilter = useMemo(() => {
    return `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedMonth]);
  
  // Calculate profitability data with filters
  const profitabilityData = useMemo(() => {
    setIsLoading(true);
    
    const filteredRecipes = selectedRecipeId 
      ? recipes.filter(recipe => recipe.id === selectedRecipeId)
      : recipes;
    
    return calculateProfitabilityData(
      filteredRecipes,
      productions,
      shippings,
      dateFilter
    );
  }, [shippings, productions, recipes, selectedRecipeId, dateFilter]);
  
  // Calculate cost data for the chart
  const costChartData = useMemo(() => {
    if (!selectedRecipeId && profitabilityData.length > 0) {
      return []; // Don't show chart for "All products" view
    }
    
    const recipe = selectedRecipeId 
      ? recipes.find(r => r.id === selectedRecipeId)
      : null;
    
    if (!recipe) return [];
    
    return calculateDailyCosts(
      recipe,
      productions,
      selectedMonth
    );
  }, [selectedRecipeId, productions, selectedMonth, profitabilityData, recipes]);
  
  // Get the output unit for the selected recipe (for chart labels)
  const outputUnit = useMemo(() => {
    if (!selectedRecipeId) return '';
    const recipe = recipes.find(r => r.id === selectedRecipeId);
    return recipe ? recipe.outputUnit : '';
  }, [selectedRecipeId, recipes]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [profitabilityData]);
  
  return {
    profitabilityData,
    costChartData,
    isLoading,
    selectedMonth,
    setSelectedMonth,
    selectedRecipeId,
    setSelectedRecipeId,
    recipes,
    outputUnit
  };
};
