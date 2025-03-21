
import { useCallback } from 'react';
import { Recipe, ProductionBatch } from '@/store/types';
import { calculateTotalProductionCost, calculateSemiFinishedCostBreakdown } from '../utils/productionCalculator';

export const useProductionCost = (
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  productions: ProductionBatch[]
) => {
  // Calculate total production cost
  const calculateCost = useCallback((recipeId: string, quantity: number): number => {
    return calculateTotalProductionCost(
      recipeId, 
      quantity, 
      recipes, 
      ingredients, 
      receipts, 
      productions
    );
  }, [recipes, ingredients, receipts, productions]);
  
  // Calculate semi-finished cost breakdown
  const calculateSemiFinishedCosts = useCallback((production: ProductionBatch) => {
    return calculateSemiFinishedCostBreakdown(
      production.recipeId,
      production.quantity,
      recipes,
      productions
    );
  }, [recipes, productions]);
  
  return {
    calculateCost,
    calculateSemiFinishedCosts
  };
};
