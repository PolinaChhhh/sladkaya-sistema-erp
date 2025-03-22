
import { format } from 'date-fns';
import { MovementEvent } from '@/features/recipes/product-movement/types';
import { calculateMovementHistory } from './movementHistoryUtils';

interface DailyCostData {
  date: string;
  unitCost: number;
  formattedDate: string;
}

/**
 * Calculate daily average costs from production events
 */
export function calculateDailyCosts(
  recipe: { id: string, name: string, outputUnit: string },
  productions: any[],
  selectedMonth: Date
): DailyCostData[] {
  console.log(`Calculating daily costs for ${recipe.name} in ${format(selectedMonth, 'MMMM yyyy')}`);
  
  // Generate month filter string (YYYY-MM format)
  const monthFilter = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  
  // Get movement history for this recipe in the selected month
  const movementHistory = calculateMovementHistory(
    recipe,
    productions,
    [], // No shipments needed for production cost analysis
    monthFilter
  );
  
  // Get only production events
  const productionEvents = movementHistory.filter(event => event.type === 'production');
  
  if (productionEvents.length === 0) return [];
  
  // Group by day and calculate average cost
  const costsByDay = groupProductionsByDay(productionEvents);
  
  // Sort by date
  return costsByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Group production events by day and calculate average unit cost
 */
function groupProductionsByDay(productionEvents: MovementEvent[]): DailyCostData[] {
  const dayMap = new Map<string, { totalCost: number; totalQuantity: number }>();
  
  // Group events by day
  productionEvents.forEach(event => {
    const date = event.date.split('T')[0]; // Get YYYY-MM-DD format
    
    if (!dayMap.has(date)) {
      dayMap.set(date, { totalCost: 0, totalQuantity: 0 });
    }
    
    const entry = dayMap.get(date)!;
    entry.totalCost += event.quantity * event.unitValue;
    entry.totalQuantity += event.quantity;
  });
  
  // Convert to array with calculated averages
  return Array.from(dayMap.entries()).map(([date, { totalCost, totalQuantity }]) => {
    const avgUnitCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    const jsDate = new Date(date);
    
    return {
      date,
      unitCost: avgUnitCost,
      formattedDate: format(jsDate, 'd MMM') // Format as "15 Jan"
    };
  });
}
