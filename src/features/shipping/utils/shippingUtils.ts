
import { ShippingDocument } from '@/store/recipeStore';

export const getProductName = (productions: any[], recipes: any[], productionBatchId: string): string => {
  const production = productions.find(p => p.id === productionBatchId);
  if (!production) return 'Неизвестный продукт';
  
  const recipe = recipes.find(r => r.id === production.recipeId);
  return recipe ? recipe.name : 'Неизвестный рецепт';
};

export const getProductUnit = (productions: any[], recipes: any[], productionBatchId: string): string => {
  const production = productions.find(p => p.id === productionBatchId);
  if (!production) return '';
  
  const recipe = recipes.find(r => r.id === production.recipeId);
  return recipe ? recipe.outputUnit : '';
};

export const getAvailableQuantity = (
  productions: any[],
  shippings: ShippingDocument[],
  productionBatchId: string
): number => {
  const production = productions.find(p => p.id === productionBatchId);
  if (!production) return 0;
  
  const shippedQuantity = shippings.reduce((total, shipping) => {
    return total + shipping.items
      .filter(item => item.productionBatchId === productionBatchId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, 0);
  
  return production.quantity - shippedQuantity;
};
