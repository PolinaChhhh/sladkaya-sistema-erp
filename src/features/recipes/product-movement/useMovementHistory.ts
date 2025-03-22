
import { useMemo } from 'react';
import { ProductionBatch, Recipe, ShippingDocument } from '@/store/types';
import { MovementEvent } from './types';

export const useMovementHistory = (
  recipe: Recipe | null,
  productions: ProductionBatch[],
  shippings: ShippingDocument[],
  dateFilter: string
) => {
  const movementHistory = useMemo(() => {
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
      shipping.items.forEach(item => {
        // Find the production batch to check if it's for this recipe
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
        return format(eventDate, 'yyyy-MM-dd').includes(dateFilter);
      });
  }, [recipe, productions, shippings, dateFilter]);

  return movementHistory;
};

// Helper function to format date
const format = (date: Date, formatString: string) => {
  return date.toISOString().split('T')[0]; // Simple YYYY-MM-DD format
};
