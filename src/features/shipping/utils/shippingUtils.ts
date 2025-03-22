
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

// Calculate available stock quantity for a production batch, factoring in all shipments including drafts
export const getAvailableQuantity = (
  productions: any[],
  shippings: ShippingDocument[],
  productionBatchId: string
): number => {
  const production = productions.find(p => p.id === productionBatchId);
  if (!production) return 0;
  
  // Calculate already shipped quantity, including drafts
  const shippedQuantity = shippings.reduce((total, shipping) => {
    return total + shipping.items
      .filter(item => item.productionBatchId === productionBatchId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, 0);
  
  console.log(`Production ${productionBatchId}, total: ${production.quantity}, shipped: ${shippedQuantity}, available: ${production.quantity - shippedQuantity}`);
  
  // Stock quantity is production quantity minus shipped quantity
  return Math.max(0, production.quantity - shippedQuantity);
};

// Get all products in stock (with positive available quantity), grouped by recipe
export const getProductsInStock = (
  productions: any[],
  shippings: ShippingDocument[],
  recipes: any[]
): { 
  recipeId: string;
  recipeName: string;
  availableQuantity: number;
  unit: string;
  cost: number;
  // Reference to the first production batch ID for this recipe (for compatibility)
  firstProductionBatchId: string;
}[] => {
  // First calculate available quantity for each production batch
  const productBatches = productions
    .map(production => {
      const recipe = recipes.find(r => r.id === production.recipeId);
      
      // Calculate already shipped quantity, including drafts
      const shippedQuantity = shippings.reduce((total, shipping) => {
        return total + shipping.items
          .filter(item => item.productionBatchId === production.id)
          .reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      
      const availableQuantity = Math.max(0, production.quantity - shippedQuantity);
      
      return {
        productionBatchId: production.id,
        recipeName: recipe ? recipe.name : 'Неизвестный рецепт',
        recipeId: production.recipeId,
        availableQuantity,
        unit: recipe ? recipe.outputUnit : 'шт',
        cost: production.cost || 0,
        unitCost: production.quantity > 0 ? production.cost / production.quantity : 0
      };
    })
    // Filter out products with zero or negative available quantity
    .filter(product => product.availableQuantity > 0);
  
  // Now group by recipe ID
  const groupedProducts: Record<string, {
    recipeId: string;
    recipeName: string;
    availableQuantity: number;
    unit: string;
    cost: number;
    firstProductionBatchId: string;
    batches: Array<{
      productionBatchId: string;
      availableQuantity: number;
      unitCost: number;
    }>;
  }> = {};
  
  productBatches.forEach(product => {
    const recipeId = product.recipeId;
    
    if (!groupedProducts[recipeId]) {
      groupedProducts[recipeId] = {
        recipeId: product.recipeId,
        recipeName: product.recipeName,
        availableQuantity: product.availableQuantity,
        unit: product.unit,
        cost: product.cost,
        firstProductionBatchId: product.productionBatchId,
        batches: [{
          productionBatchId: product.productionBatchId,
          availableQuantity: product.availableQuantity,
          unitCost: product.unitCost
        }]
      };
    } else {
      // Add to existing group
      groupedProducts[recipeId].availableQuantity += product.availableQuantity;
      
      // Track all production batches for this recipe
      groupedProducts[recipeId].batches.push({
        productionBatchId: product.productionBatchId,
        availableQuantity: product.availableQuantity,
        unitCost: product.unitCost
      });
      
      // Update weighted average cost
      const totalQuantity = groupedProducts[recipeId].availableQuantity;
      const previousCost = groupedProducts[recipeId].cost;
      const previousQuantity = totalQuantity - product.availableQuantity;
      const weightedAvgCost = (previousCost * previousQuantity + product.cost) / totalQuantity;
      
      groupedProducts[recipeId].cost = weightedAvgCost;
    }
  });
  
  console.log('Grouped products in stock with all batches:', groupedProducts);
  return Object.values(groupedProducts);
};

// Get all production batches for a given recipe with available quantities
export const getAvailableProductionBatches = (
  productions: any[],
  shippings: ShippingDocument[],
  recipeId: string
): Array<{
  productionBatchId: string;
  availableQuantity: number;
  unitCost: number;
  totalCost: number;
}> => {
  return productions
    .filter(p => p.recipeId === recipeId)
    .map(production => {
      // Calculate already shipped quantity
      const shippedQuantity = shippings.reduce((total, shipping) => {
        return total + shipping.items
          .filter(item => item.productionBatchId === production.id)
          .reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      
      const availableQuantity = Math.max(0, production.quantity - shippedQuantity);
      const unitCost = production.quantity > 0 ? production.cost / production.quantity : 0;
      
      return {
        productionBatchId: production.id,
        availableQuantity,
        unitCost,
        totalCost: production.cost
      };
    })
    .filter(batch => batch.availableQuantity > 0)
    .sort((a, b) => a.unitCost - b.unitCost); // Sort by unit cost for FIFO
};
