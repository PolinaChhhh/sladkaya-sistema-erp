
import { useStore } from '@/store/recipeStore';
import { useMemo, useState, useEffect } from 'react';
import { ProfitabilityData } from '../types/reports';
import { MovementEvent } from '@/features/recipes/product-movement/types';

export const useProductProfitability = () => {
  const { shippings, productions, recipes } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate profitability data from the movement history
  const profitabilityData = useMemo(() => {
    // Create a map to aggregate data by recipe ID
    const productMap = new Map<string, ProfitabilityData>();
    
    // Process all recipes
    recipes.forEach(recipe => {
      // Get movement history for this recipe
      const movementHistory = calculateMovementHistory(
        recipe,
        productions,
        shippings,
        '' // No date filter
      );
      
      // Only process recipes that have any movements
      if (movementHistory.length === 0) return;
      
      // Get all shipment events for this recipe
      const shipmentEvents = movementHistory.filter(event => event.type === 'shipment');
      
      // Skip if no shipments
      if (shipmentEvents.length === 0) return;
      
      // Initialize tracking variables
      let totalRevenue = 0;
      let totalCost = 0;
      let quantitySold = 0;
      
      // Map shipping items to their corresponding shipments for lookup
      const shippingItemsMap = new Map<string, {
        shipmentNumber: string;
        date: string;
        items: Array<{
          productionBatchId: string;
          quantity: number;
          price: number;
        }>;
      }>();
      
      // Build a map of shipping documents with batch information
      shippings.forEach(shipping => {
        if (shipping.status === 'draft') return; // Skip drafts
        
        // Get all shipping items related to this recipe
        const recipeItems = shipping.items.filter(item => {
          const prod = productions.find(p => p.id === item.productionBatchId);
          return prod && prod.recipeId === recipe.id;
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
      
      // For each recipe, build a map of production events by batch ID for efficient lookup
      const productionEventsByBatchId = movementHistory
        .filter(event => event.type === 'production')
        .reduce((acc, event) => {
          if (event.batchId) {
            acc[event.batchId] = event;
          }
          return acc;
        }, {} as Record<string, MovementEvent>);
      
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
      if (quantitySold === 0) return;
      
      // Calculate gross profit and profitability percentage
      const grossProfit = totalRevenue - totalCost;
      const profitabilityPercent = totalCost > 0 
        ? (grossProfit / totalCost) * 100 
        : 0;
      
      // Add to product map
      productMap.set(recipe.id, {
        recipeId: recipe.id,
        productName: recipe.name,
        quantitySold,
        totalCost,
        totalRevenue,
        grossProfit,
        profitabilityPercent,
        unit: recipe.outputUnit
      });
    });
    
    // Convert the map to an array and sort by profitability (descending)
    return Array.from(productMap.values())
      .sort((a, b) => b.profitabilityPercent - a.profitabilityPercent);
  }, [shippings, productions, recipes]);
  
  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    profitabilityData,
    isLoading
  };
};

/**
 * Helper function to calculate movement history data for a recipe
 * This is derived from the original useMovementHistory but adapted for direct calculation
 */
function calculateMovementHistory(
  recipe: { id: string, name: string } | null,
  productions: any[],
  shippings: any[],
  dateFilter: string
): MovementEvent[] {
  if (!recipe) return [];
  
  const events: MovementEvent[] = [];
  
  // Add production events
  const recipeProductions = productions
    .filter(p => p.recipeId === recipe.id)
    .map(prod => ({
      date: prod.date,
      type: 'production' as const,
      quantity: prod.quantity,
      unitValue: prod.quantity > 0 ? prod.cost / prod.quantity : 0,
      reference: `Производство ID: ${prod.id.substring(0, 8)}`,
      batchId: prod.id
    }));
  
  events.push(...recipeProductions);
  
  // Add shipment events, but only for finalized shipments (not drafts)
  shippings.forEach(shipping => {
    if (shipping.status === 'draft') return; // Skip drafts for reports
    
    shipping.items.forEach(item => {
      // Find the related production to ensure it's for this recipe
      const relatedProduction = productions.find(p => p.id === item.productionBatchId);
      
      if (relatedProduction && relatedProduction.recipeId === recipe.id) {
        events.push({
          date: shipping.date,
          type: 'shipment',
          quantity: -item.quantity, // Negative to indicate reduction
          unitValue: item.price,
          reference: `Отгрузка №${shipping.shipmentNumber}`,
          batchId: item.productionBatchId
        });
      }
    });
  });
  
  // Sort by date, most recent first
  return events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(event => {
      // Apply date filter if present
      if (!dateFilter) return true;
      
      const eventDate = new Date(event.date);
      const formattedDate = formatDate(eventDate);
      return formattedDate.includes(dateFilter);
    });
}

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Simple YYYY-MM-DD format
};
