
import { StateCreator } from 'zustand';
import { ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';
import { ReceiptSlice } from './receiptSlice';
import { consumeIngredientsWithFifo, restoreIngredientsToReceipts } from '../utils/fifoCalculator';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

type StoreWithDependencies = IngredientSlice & ReceiptSlice;

export const createProductionSlice: StateCreator<
  ProductionSlice & StoreWithDependencies,
  [],
  [],
  ProductionSlice
> = (set, get) => ({
  productions: [],
  
  addProduction: (production) => set((state) => {
    // Get recipe details
    const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
    const recipe = recipes.find(r => r.id === production.recipeId);
    
    if (!recipe) {
      console.error('Recipe not found');
      return { productions: state.productions };
    }
    
    // Calculate cost using FIFO method
    const cost = consumeIngredientsWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Create new production with calculated cost
    const newProduction = {
      ...production,
      id: crypto.randomUUID(),
      cost: cost,
      date: new Date().toISOString()
    };
    
    return {
      productions: [...state.productions, newProduction]
    };
  }),
  
  updateProduction: (id, data) => set((state) => {
    const originalProduction = state.productions.find(p => p.id === id);
    
    if (!originalProduction) {
      return { productions: state.productions };
    }
    
    // If quantity changed, recalculate ingredient consumption
    if (data.quantity && data.quantity !== originalProduction.quantity) {
      const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
      const recipe = recipes.find(r => r.id === originalProduction.recipeId);
      
      if (recipe) {
        // First restore the original ingredients
        restoreIngredientsToReceipts(
          recipe,
          originalProduction.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        // Then consume the new amount
        const newCost = consumeIngredientsWithFifo(
          recipe,
          data.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        // Update the cost along with other changes
        data.cost = newCost;
      }
    }
    
    return {
      productions: state.productions.map(production =>
        production.id === id ? { ...production, ...data } : production
      )
    };
  }),
  
  deleteProduction: (id) => set((state) => {
    const productionToDelete = state.productions.find(p => p.id === id);
    
    if (productionToDelete) {
      const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
      const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
      
      if (recipe) {
        // Restore ingredients back to receipts
        restoreIngredientsToReceipts(
          recipe,
          productionToDelete.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
      }
    }
    
    return {
      productions: state.productions.filter(production => production.id !== id)
    };
  })
});
