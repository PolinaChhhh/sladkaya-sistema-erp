
import { ProfitabilityData } from '../types/reports';
import { MovementEvent } from '@/features/recipes/product-movement/types';
import { calculateMovementHistory } from './movementHistoryUtils';

/**
 * Builds a map of shipping documents with batch information
 */
export function buildShippingItemsMap(
  shippings: any[],
  productions: any[],
  recipeId: string
): Map<string, {
  shipmentNumber: string;
  date: string;
  items: Array<{
    productionBatchId: string;
    quantity: number;
    price: number;
  }>;
}> {
  const shippingItemsMap = new Map();
  
  shippings.forEach(shipping => {
    if (shipping.status === 'draft') return; // Skip drafts
    
    // Get all shipping items related to this recipe
    const recipeItems = shipping.items.filter(item => {
      const prod = productions.find(p => p.id === item.productionBatchId);
      return prod && prod.recipeId === recipeId;
    });
    
    if (recipeItems.length > 0) {
      shippingItemsMap.set(shipping.id, {
        shipmentNumber: shipping.shipmentNumber,
        date: shipping.date,
        items: recipeItems.map(item => ({
          productionBatchId: item.productionBatchId,
          quantity: item.quantity,
          // Convert price to number if it's a string to ensure type safety
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }))
      });
    }
  });
  
  return shippingItemsMap;
}

/**
 * Builds a map of production events by batch ID for efficient lookup
 */
export function buildProductionEventsByBatchId(
  movementHistory: MovementEvent[]
): Record<string, MovementEvent> {
  return movementHistory
    .filter(event => event.type === 'production')
    .reduce((acc, event) => {
      if (event.batchId) {
        acc[event.batchId] = event;
      }
      return acc;
    }, {} as Record<string, MovementEvent>);
}

/**
 * Calculate the profitability data for a single recipe
 */
export function calculateRecipeProfitability(
  recipe: { id: string, name: string, outputUnit: string },
  productions: any[],
  shippings: any[]
): ProfitabilityData | null {
  // Get movement history for this recipe
  const movementHistory = calculateMovementHistory(
    recipe,
    productions,
    shippings,
    '' // No date filter
  );
  
  // Only process recipes that have any movements
  if (movementHistory.length === 0) return null;
  
  // Get all shipment events for this recipe
  const shipmentEvents = movementHistory.filter(event => event.type === 'shipment');
  
  // Skip if no shipments
  if (shipmentEvents.length === 0) return null;
  
  // Build a map of production events by batch ID for efficient lookup
  const productionEventsByBatchId = buildProductionEventsByBatchId(movementHistory);
  
  // Initialize tracking variables
  let totalRevenue = 0;
  let totalCost = 0;
  let quantitySold = 0;
  
  // Process each shipment event to calculate revenue and cost
  shipmentEvents.forEach(shipment => {
    const batchId = shipment.batchId;
    if (!batchId) return;
    
    // Find the corresponding production event for this batch
    const productionEvent = productionEventsByBatchId[batchId];
    if (!productionEvent) return;
    
    // Get the absolute quantity from the shipment (shipment quantities are negative)
    const shipmentQuantity = Math.abs(shipment.quantity);
    
    // Calculate revenue from this shipment using the shipment's unit price
    const shipmentRevenue = shipmentQuantity * shipment.unitValue;
    totalRevenue += shipmentRevenue;
    
    // Calculate cost using the production batch's unit cost
    const shipmentCost = shipmentQuantity * productionEvent.unitValue;
    totalCost += shipmentCost;
    
    // Add to total quantity sold
    quantitySold += shipmentQuantity;
  });
  
  // Skip if no quantity was sold
  if (quantitySold === 0) return null;
  
  // Calculate gross profit and profitability percentage
  const grossProfit = totalRevenue - totalCost;
  const profitabilityPercent = totalCost > 0 
    ? (grossProfit / totalCost) * 100 
    : 0;
  
  return {
    recipeId: recipe.id,
    productName: recipe.name,
    quantitySold,
    totalCost,
    totalRevenue,
    grossProfit,
    profitabilityPercent,
    unit: recipe.outputUnit
  };
}

/**
 * Calculate profitability data for all recipes
 */
export function calculateProfitabilityData(
  recipes: any[],
  productions: any[],
  shippings: any[]
): ProfitabilityData[] {
  // Create a map to aggregate data by recipe ID
  const productMap = new Map<string, ProfitabilityData>();
  
  // Process all recipes
  recipes.forEach(recipe => {
    const profitabilityData = calculateRecipeProfitability(recipe, productions, shippings);
    if (profitabilityData) {
      productMap.set(recipe.id, profitabilityData);
    }
  });
  
  // Convert the map to an array and sort by profitability (descending)
  return Array.from(productMap.values())
    .sort((a, b) => b.profitabilityPercent - a.profitabilityPercent);
}
