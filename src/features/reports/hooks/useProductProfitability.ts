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
    
    // First, log all productions for debugging
    console.log('All productions:');
    productions.forEach(p => {
      const recipe = recipes.find(r => r.id === p.recipeId);
      if (recipe) {
        console.log(`Production: ${recipe.name}, quantity: ${p.quantity}, cost: ${p.cost}, unitCost: ${p.quantity > 0 ? p.cost / p.quantity : 0}`);
      }
    });
    
    // Process all shipped items
    shippings.forEach(shipping => {
      // Only include shipped or delivered items
      if (shipping.status === 'draft') return;
      
      console.log(`Processing shipping ${shipping.id}, status: ${shipping.status}`);
      
      shipping.items.forEach(item => {
        // Find the production batch for this shipment item
        const production = productions.find(p => p.id === item.productionBatchId);
        if (!production) {
          console.log(`Production not found for item in shipping ${shipping.id}, productionBatchId: ${item.productionBatchId}`);
          return;
        }
        
        // Find the recipe for this production
        const recipe = recipes.find(r => r.id === production.recipeId);
        if (!recipe) {
          console.log(`Recipe not found for production ${production.id}, recipeId: ${production.recipeId}`);
          return;
        }
        
        // Calculate revenue including VAT
        const priceWithVat = item.price * (1 + item.vatRate / 100);
        const revenue = priceWithVat * item.quantity;
        
        // Get the unit cost from the production - use the ACTUAL production cost
        const unitCost = production.quantity > 0 ? production.cost / production.quantity : 0;
        const cost = unitCost * item.quantity;
        
        console.log(`Shipped item: ${recipe.name}, quantity: ${item.quantity}, unitCost: ${unitCost}, totalCost: ${cost}, recipeId: ${recipe.id}, productionId: ${production.id}`);
        
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
    
    // Check if all productions are accounted for in the report
    productions.forEach(p => {
      const recipe = recipes.find(r => r.id === p.recipeId);
      if (recipe && !productMap.has(recipe.id)) {
        console.log(`Production for ${recipe.name} (${recipe.id}) exists but is not in the report - may not be shipped yet`);
      }
    });
    
    // Check if any shipped items don't match production IDs
    console.log('Checking for shipping-production mismatches:');
    const productionIds = new Set(productions.map(p => p.id));
    shippings.forEach(shipping => {
      if (shipping.status !== 'draft') {
        shipping.items.forEach(item => {
          if (!productionIds.has(item.productionBatchId)) {
            console.log(`Shipping ${shipping.id} references non-existent production ID: ${item.productionBatchId}`);
          }
        });
      }
    });
    
    // Log all products in the report
    console.log(`Products in profitability report: ${Array.from(productMap.keys()).length}`);
    console.log(`Recipe IDs in report: ${Array.from(productMap.keys()).join(', ')}`);
    
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
