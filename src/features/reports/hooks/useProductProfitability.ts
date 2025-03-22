
import { useStore } from '@/store/recipeStore';
import { useMemo, useState, useEffect } from 'react';
import { ProfitabilityData } from '../types/reports';
import { useMovementHistory } from '@/features/recipes/product-movement/useMovementHistory';
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
      const movementHistory = useMovementHistoryCalculations(
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
      
      // Calculate total shipped quantity
      const quantitySold = Math.abs(
        shipmentEvents.reduce((sum, event) => sum + event.quantity, 0)
      );
      
      // Calculate total revenue from shipments
      const totalRevenue = shipmentEvents.reduce(
        (sum, event) => sum + (Math.abs(event.quantity) * event.unitValue),
        0
      );
      
      // Calculate total cost from the shipped items based on their production events
      // For each shipment, find the corresponding production events to calculate cost
      let totalCost = 0;
      
      // Process each shipment
      shipmentEvents.forEach(shipment => {
        const batchId = shipment.batchId;
        if (!batchId) return;
        
        // Find the production event for this batch
        const productionEvent = movementHistory.find(
          event => event.type === 'production' && event.batchId === batchId
        );
        
        if (productionEvent) {
          // Calculate the portion of the production cost that was shipped
          const productionQuantity = productionEvent.quantity;
          const shipmentQuantity = Math.abs(shipment.quantity);
          const portionShipped = productionQuantity > 0 
            ? shipmentQuantity / productionQuantity 
            : 0;
          
          // Add the proportional cost to the total
          totalCost += (productionEvent.unitValue * shipmentQuantity);
        }
      });
      
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
 * This is derived from useMovementHistory but simplified for direct calculation
 */
function useMovementHistoryCalculations(
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
  
  // Add shipment events
  shippings.forEach(shipping => {
    if (shipping.status === 'draft') return; // Skip drafts for reports
    
    shipping.items.forEach(item => {
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
