
import { Recipe, Ingredient, ProductionBatch } from '@/store/types';
import { getIngredientDetails } from '@/features/production/utils/calculations/ingredientDetails';

interface CostBreakdownItem {
  name: string;
  value: number;
  percent: number;
  color: string;
}

/**
 * Calculate breakdown of costs by ingredient categories based on actual production data
 */
export function calculateCostBreakdown(
  recipe: Recipe,
  allRecipes: Recipe[],
  ingredients: Ingredient[],
  productions: ProductionBatch[],
  selectedMonth: Date
): CostBreakdownItem[] {
  // Filter productions for the selected recipe and month
  const monthFilter = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const recipeProductions = productions.filter(p => 
    p.recipeId === recipe.id && 
    p.date.startsWith(monthFilter)
  );
  
  if (recipeProductions.length === 0) return [];
  
  // Calculate total production quantity and cost
  const totalQuantity = recipeProductions.reduce((sum, p) => sum + p.quantity, 0);
  const totalCost = recipeProductions.reduce((sum, p) => sum + p.cost, 0);
  
  if (totalQuantity === 0 || totalCost === 0) return [];
  
  // Analyze ingredient consumption from production details
  let packagingCosts = 0;
  let rawMaterialCosts = 0;
  
  // Go through all productions and their consumption details
  recipeProductions.forEach(production => {
    if (!production.consumptionDetails) return;
    
    // Check each ingredient in the consumption details
    Object.keys(production.consumptionDetails).forEach(ingredientId => {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;
      
      // Calculate cost for this ingredient in this production
      const consumedItems = production.consumptionDetails[ingredientId];
      const ingredientCost = consumedItems.reduce((sum, item: any) => 
        sum + (item.amount * item.unitPrice), 0);
      
      // Categorize cost as packaging or raw material
      if (ingredient.type === 'Упаковка') {
        packagingCosts += ingredientCost;
      } else {
        rawMaterialCosts += ingredientCost;
      }
    });
  });
  
  // If we couldn't extract categorized costs from consumption details,
  // estimate based on typical percentages from the recipe
  if (packagingCosts === 0 && rawMaterialCosts === 0) {
    // As a fallback, assume 80% raw materials, 20% packaging
    rawMaterialCosts = totalCost * 0.8;
    packagingCosts = totalCost * 0.2;
  }
  
  // Define color scheme for chart
  const colors = {
    rawMaterials: '#10b981', // Emerald
    packaging: '#6366f1',    // Indigo
  };
  
  // Create data for chart
  const breakdownData: CostBreakdownItem[] = [
    {
      name: 'Сырьё',
      value: rawMaterialCosts,
      percent: (rawMaterialCosts / totalCost) * 100,
      color: colors.rawMaterials
    },
    {
      name: 'Упаковка',
      value: packagingCosts,
      percent: (packagingCosts / totalCost) * 100,
      color: colors.packaging
    }
  ];
  
  return breakdownData;
}
