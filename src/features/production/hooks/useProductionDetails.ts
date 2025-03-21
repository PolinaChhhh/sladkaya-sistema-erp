
import { useState, useMemo } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch, Recipe, Ingredient, Receipt } from '@/store/types';
import { IngredientUsageDetail } from '../components/ProductionDetailDialog';
import { getFifoReceiptItems } from '@/store/utils/fifoCalculator';

export const useProductionDetails = () => {
  const { recipes, ingredients, receipts } = useStore();
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

  // Simulate ingredient usage by analyzing recipe and production
  const getIngredientUsageDetails = (production: ProductionBatch): IngredientUsageDetail[] => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    if (!recipe) return [];

    const productionRatio = production.quantity / recipe.output;
    const details: IngredientUsageDetail[] = [];

    // Get direct ingredients from recipe
    recipe.items
      .filter(item => item.type === 'ingredient' && item.ingredientId)
      .forEach(item => {
        const ingredientId = item.ingredientId as string;
        const ingredient = ingredients.find(i => i.id === ingredientId);
        if (!ingredient) return;

        const totalAmount = item.amount * productionRatio;
        
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
    getIngredientUsageDetails
  };
};
