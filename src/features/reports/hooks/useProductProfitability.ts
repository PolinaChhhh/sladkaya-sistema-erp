import { useStore } from '@/store/recipeStore';
import { useMemo, useState, useEffect } from 'react';
import { ProfitabilityData } from '../types/reports';

export const useProductProfitability = () => {
  const { shippings, productions, recipes } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate profitability data from shipments and productions
  const profitabilityData = useMemo(() => {
    // Create a map to aggregate data by recipe ID
    const productMap = new Map<string, ProfitabilityData>();
    
    // Process all shipped items
    shippings.forEach(shipping => {
      // Only include shipped or delivered items
      if (shipping.status === 'draft') return;
      
      shipping.items.forEach(item => {
        // Find the production batch for this shipment item
        const production = productions.find(p => p.id === item.productionBatchId);
        if (!production) return;
        
        // Find the recipe for this production
        const recipe = recipes.find(r => r.id === production.recipeId);
        if (!recipe) return;
        
        // Calculate revenue including VAT
        const priceWithVat = item.price * (1 + item.vatRate / 100);
        const revenue = priceWithVat * item.quantity;
        
        // Get the unit cost from the production
        const unitCost = production.quantity > 0 ? production.cost / production.quantity : 0;
        const cost = unitCost * item.quantity;
        
        // If we already have this recipe in our map, update the values
        if (productMap.has(recipe.id)) {
          const existing = productMap.get(recipe.id)!;
          existing.quantitySold += item.quantity;
          existing.totalCost += cost;
          existing.totalRevenue += revenue;
          existing.grossProfit = existing.totalRevenue - existing.totalCost;
          existing.profitabilityPercent = existing.totalCost > 0 
            ? (existing.grossProfit / existing.totalCost) * 100 
            : 0;
        } else {
          // Otherwise, create a new entry
          productMap.set(recipe.id, {
            recipeId: recipe.id,
            productName: recipe.name,
            quantitySold: item.quantity,
            totalCost: cost,
            totalRevenue: revenue,
            grossProfit: revenue - cost,
            profitabilityPercent: cost > 0 ? ((revenue - cost) / cost) * 100 : 0,
            unit: recipe.outputUnit
          });
        }
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
