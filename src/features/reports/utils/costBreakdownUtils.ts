
import { Recipe, Ingredient } from '@/store/types';
import { getIngredientDetails } from '@/features/production/utils/calculations/ingredientDetails';

interface CostBreakdownItem {
  name: string;
  value: number;
  percent: number;
  color: string;
}

/**
 * Calculate breakdown of costs by ingredient categories
 */
export function calculateCostBreakdown(
  recipe: Recipe,
  allRecipes: Recipe[],
  ingredients: Ingredient[],
  productions: any[],
  selectedMonth: Date
): CostBreakdownItem[] {
  // Calculate total costs and ingredient breakdown
  const quantity = 1; // Calculate for 1 unit of output
  const ingredientDetails = getIngredientDetails(allRecipes, recipe.id, recipe.output, ingredients);
  
  if (ingredientDetails.length === 0) return [];
  
  // Calculate total cost
  const totalCost = ingredientDetails.reduce((total, item) => total + item.cost, 0);
  
  // Group by categories (packaging vs raw materials)
  const packagingCosts = ingredientDetails
    .filter(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      return ingredient && ingredient.isPackaging;
    })
    .reduce((sum, item) => sum + item.cost, 0);
    
  const rawMaterialCosts = totalCost - packagingCosts;
  
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
