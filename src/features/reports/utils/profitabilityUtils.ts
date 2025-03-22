
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
  shippings: any[],
  dateFilter: string
): ProfitabilityData | null {
  // Get movement history for this recipe with date filter
  const movementHistory = calculateMovementHistory(
    recipe,
    productions,
    shippings,
    dateFilter // This is now passed to filter by date
  );
  
  // Only process recipes that have any movements
  if (movementHistory.length === 0) return null;
  
  // Get all shipment events for this recipe
  const shipmentEvents = movementHistory.filter(event => event.type === 'shipment');
  
  // Skip if no shipments
  if (shipmentEvents.length === 0) return null;
  
  // Get all production events for this recipe, sorted by date (oldest first for FIFO)
  const productionEvents = movementHistory
    .filter(event => event.type === 'production')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Create a queue of available production batches with remaining quantities
  const productionQueue: {
    batchId: string;
    date: string;
    remainingQuantity: number;
    unitCost: number;
  }[] = productionEvents.map(event => ({
    batchId: event.batchId!,
    date: event.date,
    remainingQuantity: event.quantity,
    unitCost: event.unitValue
  }));
  
  // Initialize tracking variables
  let totalRevenue = 0;
  let totalCost = 0;
  let quantitySold = 0;
  
  // Process each shipment event in chronological order (oldest first)
  shipmentEvents
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach(shipment => {
      // Skip shipments outside the date filter if it exists
      if (dateFilter && !shipment.date.includes(dateFilter)) {
        return;
      }
      
      // Get the absolute quantity from the shipment (shipment quantities are negative)
      const shipmentQuantity = Math.abs(shipment.quantity);
      let remainingToShip = shipmentQuantity;
      
      // Calculate revenue from this shipment
      const shipmentRevenue = shipmentQuantity * shipment.unitValue;
      totalRevenue += shipmentRevenue;
      
      // Track costs for this specific shipment for detailed logging
      let shipmentCost = 0;
      let shipmentsFromBatches = [];
      
      console.log(`Processing shipment ${shipment.reference} for ${shipmentQuantity} units of ${recipe.name} at ${shipment.unitValue}₽ per unit`);
      
      // Consume from production batches using FIFO
      while (remainingToShip > 0 && productionQueue.length > 0) {
        const batch = productionQueue[0];
        
        // If this batch is empty, remove it and continue
        if (batch.remainingQuantity <= 0) {
          productionQueue.shift();
          continue;
        }
        
        // Calculate how much to take from this batch
        const takeFromBatch = Math.min(remainingToShip, batch.remainingQuantity);
        
        // Calculate cost for this portion
        const batchCost = takeFromBatch * batch.unitCost;
        shipmentCost += batchCost;
        
        // Track which batch was used
        shipmentsFromBatches.push({
          batchId: batch.batchId,
          quantity: takeFromBatch,
          unitCost: batch.unitCost,
          totalCost: batchCost,
          date: batch.date
        });
        
        // Update batch remaining quantity
        batch.remainingQuantity -= takeFromBatch;
        remainingToShip -= takeFromBatch;
        
        // If batch is now empty, remove it
        if (batch.remainingQuantity <= 0) {
          productionQueue.shift();
        }
        
        console.log(`  - Used ${takeFromBatch} units from batch ${batch.batchId} (${new Date(batch.date).toLocaleDateString()})`);
        console.log(`    Unit cost: ${batch.unitCost.toFixed(2)}₽, Portion cost: ${batchCost.toFixed(2)}₽`);
      }
      
      // If we still have remaining to ship but no batches, log a warning
      if (remainingToShip > 0) {
        console.warn(`Warning: Not enough production batches for shipment ${shipment.reference}. Missing ${remainingToShip} units.`);
      }
      
      // Add to totals
      totalCost += shipmentCost;
      quantitySold += shipmentQuantity - remainingToShip;
      
      // Log the detailed breakdown of this shipment
      console.log(`FIFO Shipment calculation for ${shipment.reference}: ${shipmentQuantity} units sold at ${shipment.unitValue}₽/unit`);
      console.log(`  - Total revenue: ${shipmentRevenue.toFixed(2)}₽`);
      console.log(`  - Total cost: ${shipmentCost.toFixed(2)}₽`);
      console.log(`  - Profit: ${(shipmentRevenue - shipmentCost).toFixed(2)}₽`);
      console.log(`  - Used ${shipmentsFromBatches.length} production batches:`);
      
      shipmentsFromBatches.forEach(batch => {
        console.log(`    * Batch ${batch.batchId} (${new Date(batch.date).toLocaleDateString()}): ${batch.quantity} units at ${batch.unitCost.toFixed(2)}₽/unit = ${batch.totalCost.toFixed(2)}₽`);
      });
    });
  
  // Skip if no quantity was sold
  if (quantitySold === 0) return null;
  
  // Calculate gross profit and profitability percentage
  const grossProfit = totalRevenue - totalCost;
  const profitabilityPercent = totalCost > 0 
    ? (grossProfit / totalCost) * 100 
    : 0;
  
  console.log(`Profitability summary for ${recipe.name}: ${quantitySold} units sold, total cost ${totalCost.toFixed(2)}₽, revenue ${totalRevenue.toFixed(2)}₽, profit ${grossProfit.toFixed(2)}₽, profitability ${profitabilityPercent.toFixed(2)}%`);
  
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
  shippings: any[],
  dateFilter: string = ''
): ProfitabilityData[] {
  console.log(`Calculating profitability data with FIFO-based costing, date filter: ${dateFilter || 'none'}`);
  
  // Create a map to aggregate data by recipe ID
  const productMap = new Map<string, ProfitabilityData>();
  
  // Process all recipes
  recipes.forEach(recipe => {
    console.log(`Processing recipe: ${recipe.name} (${recipe.id})`);
    const profitabilityData = calculateRecipeProfitability(recipe, productions, shippings, dateFilter);
    if (profitabilityData) {
      productMap.set(recipe.id, profitabilityData);
    }
  });
  
  // Convert the map to an array and sort by profitability (descending)
  return Array.from(productMap.values())
    .sort((a, b) => b.profitabilityPercent - a.profitabilityPercent);
}
