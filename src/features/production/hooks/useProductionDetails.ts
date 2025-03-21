import { useState, useMemo } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch, Recipe, Ingredient, Receipt } from '@/store/types';
import { IngredientUsageDetail } from '../components/ProductionDetailDialog';
import { getFifoReceiptItems } from '@/store/utils/fifoCalculator';
import { calculateSemiFinishedCostBreakdown } from '../utils/productionCalculator';

export const useProductionDetails = () => {
  const { recipes, ingredients, receipts, productions } = useStore();
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const selectedRecipe = useMemo(() => {
    if (!selectedProduction) return null;
    return recipes.find(r => r.id === selectedProduction.recipeId) || null;
  }, [selectedProduction, recipes]);

  const openDetailDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
  };

  const getIngredientDetails = (ingredientId: string): Ingredient | undefined => {
    return ingredients.find(i => i.id === ingredientId);
  };

  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };

  // Get all ingredients used in a recipe, including those from semi-finished products
  const getAllIngredients = (recipeId: string, ratio = 1, usedRecipeIds = new Set<string>()): { ingredientId: string, amount: number }[] => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || usedRecipeIds.has(recipeId)) return [];
    
    usedRecipeIds.add(recipeId);
    const result: { ingredientId: string, amount: number }[] = [];
    
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        // Direct ingredient
        result.push({
          ingredientId: item.ingredientId,
          amount: item.amount * ratio
        });
      } else if (item.type === 'recipe' && item.recipeId) {
        // Semi-finished product - recursively get its ingredients
        const semiFinalRecipe = recipes.find(r => r.id === item.recipeId);
        if (semiFinalRecipe) {
          const semiFinalRatio = (item.amount * ratio) / semiFinalRecipe.output;
          const semiFinalIngredients = getAllIngredients(item.recipeId, semiFinalRatio, new Set(usedRecipeIds));
          
          // Add ingredients from semi-finished product
          semiFinalIngredients.forEach(sfIngredient => {
            // Check if the ingredient is already in the result and combine if so
            const existingIngredient = result.find(r => r.ingredientId === sfIngredient.ingredientId);
            if (existingIngredient) {
              existingIngredient.amount += sfIngredient.amount;
            } else {
              result.push(sfIngredient);
            }
          });
        }
      }
    });
    
    return result;
  };

  // Get semi-finished products breakdown with accurate costs
  const getSemiFinalBreakdown = (production: ProductionBatch) => {
    if (!production) return [];
    
    return calculateSemiFinishedCostBreakdown(
      production.recipeId,
      production.quantity,
      recipes,
      productions
    );
  };

  // Simulate ingredient usage by analyzing recipe and production, including ingredients from semi-finished products
  const getIngredientUsageDetails = (production: ProductionBatch): IngredientUsageDetail[] => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    if (!recipe) return [];

    const productionRatio = production.quantity / recipe.output;
    const details: IngredientUsageDetail[] = [];

    // Get all ingredients, including those from semi-finished products
    const allIngredients = getAllIngredients(production.recipeId, productionRatio);
    
    // Group by ingredient ID and sum amounts
    const groupedIngredients: Record<string, number> = {};
    allIngredients.forEach(item => {
      groupedIngredients[item.ingredientId] = (groupedIngredients[item.ingredientId] || 0) + item.amount;
    });
    
    // Process each unique ingredient
    Object.entries(groupedIngredients).forEach(([ingredientId, totalAmount]) => {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;
      
      // Get FIFO receipts for this ingredient
      const receiptItems = getFifoReceiptItems(ingredientId, receipts);
      const usageBreakdown: IngredientUsageDetail['usageBreakdown'] = [];
      
      let remainingToConsume = totalAmount;
      let totalCost = 0;
      
      // Simulate FIFO consumption to generate breakdown
      for (const receiptItem of receiptItems) {
        if (remainingToConsume <= 0) break;
        
        const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity + (totalAmount * 0.1)); // Add a buffer for simulation
        const cost = consumeAmount * receiptItem.unitPrice;
        
        usageBreakdown.push({
          receiptDate: receiptItem.receiptDate,
          amount: consumeAmount,
          unitPrice: receiptItem.unitPrice,
          totalCost: cost
        });
        
        totalCost += cost;
        remainingToConsume -= consumeAmount;
      }
      
      // If we couldn't find receipts for everything, use current price
      if (remainingToConsume > 0) {
        usageBreakdown.push({
          receiptDate: new Date().toISOString(),
          amount: remainingToConsume,
          unitPrice: ingredient.cost,
          totalCost: remainingToConsume * ingredient.cost
        });
        
        totalCost += remainingToConsume * ingredient.cost;
      }
      
      details.push({
        ingredientId,
        ingredientName: ingredient.name,
        totalAmount,
        unit: ingredient.unit,
        usageBreakdown,
        totalCost
      });
    });

    return details;
  };

  return {
    selectedProduction,
    selectedRecipe,
    isDetailDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    getIngredientDetails,
    getRecipeName,
    getIngredientUsageDetails,
    getSemiFinalBreakdown
  };
};
