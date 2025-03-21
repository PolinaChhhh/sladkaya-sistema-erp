
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

// Calculate available stock quantity for a production batch
export const getAvailableQuantity = (
  productions: any[],
  shippings: ShippingDocument[],
  productionBatchId: string
): number => {
  const production = productions.find(p => p.id === productionBatchId);
  if (!production) return 0;
  
  // Calculate already shipped quantity
  const shippedQuantity = shippings.reduce((total, shipping) => {
    return total + shipping.items
      .filter(item => item.productionBatchId === productionBatchId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, 0);
  
  // Stock quantity is production quantity minus shipped quantity
  return production.quantity - shippedQuantity;
};

// Get all products in stock (with positive available quantity)
export const getProductsInStock = (
  productions: any[],
  shippings: ShippingDocument[],
  recipes: any[]
): { 
  productionBatchId: string;
  recipeName: string;
  recipeId: string;
  availableQuantity: number;
  unit: string;
  cost: number;
}[] => {
  const productsInStock = productions
    .map(production => {
      const recipe = recipes.find(r => r.id === production.recipeId);
      
      // Calculate already shipped quantity
      const shippedQuantity = shippings.reduce((total, shipping) => {
        return total + shipping.items
          .filter(item => item.productionBatchId === production.id)
          .reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      
      const availableQuantity = production.quantity - shippedQuantity;
      
      return {
        productionBatchId: production.id,
        recipeName: recipe ? recipe.name : 'Неизвестный рецепт',
        recipeId: production.recipeId,
        availableQuantity,
        unit: recipe ? recipe.outputUnit : 'шт',
        cost: production.cost || 0
      };
    })
    // Filter out products with zero or negative available quantity
    .filter(product => product.availableQuantity > 0);
  
  console.log('Products in stock:', productsInStock);
  return productsInStock;
};
