
import { MovementEvent } from '@/features/recipes/product-movement/types';

/**
 * Helper function to calculate movement history data for a recipe
 * This is derived from the original useMovementHistory but adapted for direct calculation
 */
export function calculateMovementHistory(
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
  
  // Filter by date if present
  const filteredEvents = events.filter(event => {
    if (!dateFilter) return true;
    
    const eventDate = new Date(event.date);
    const formattedDate = formatDate(eventDate);
    return formattedDate.includes(dateFilter);
  });
  
  // Sort by date, most recent first
  return filteredEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Helper function to format date
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Simple YYYY-MM-DD format
};
