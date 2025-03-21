
import { StateCreator } from 'zustand';
import { ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';
import { ReceiptSlice } from './receiptSlice';
import { RecipeSlice } from './recipeSlice';
import { 
  handleAddProduction, 
  handleUpdateProduction, 
  handleDeleteProduction 
} from '../operations/production/productionOperations';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => ProductionBatch | null;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

type StoreWithDependencies = IngredientSlice & ReceiptSlice & RecipeSlice;

export const createProductionSlice: StateCreator<
  ProductionSlice & StoreWithDependencies,
  [],
  [],
  ProductionSlice
> = (set, get) => ({
  productions: [],
  
  addProduction: (production) => {
    try {
      const { 
        recipes, 
        ingredients, 
        receipts, 
        productions, 
        updateIngredient, 
        updateReceiptItem, 
        updateProduction, 
        updateRecipe 
      } = get();
      
      const newProduction = handleAddProduction(
        production,
        recipes,
        ingredients,
        receipts,
        productions,
        updateIngredient,
        updateReceiptItem,
        updateProduction,
        updateRecipe
      );
      
      set((state) => ({
        productions: [...state.productions, newProduction]
      }));
      
      return newProduction;
    } catch (error) {
      console.error('Error adding production:', error);
      // Instead of silently failing, re-throw the error to be handled by the caller
      throw error;
    }
  },
  
  updateProduction: (id, data) => set((state) => {
    try {
      const { 
        recipes, 
        ingredients, 
        receipts, 
        productions, 
        updateIngredient, 
        updateReceiptItem, 
        updateProduction 
      } = get();
      
      const updatedData = handleUpdateProduction(
        id,
        data,
        productions,
        recipes,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem,
        updateProduction
      );
      
      return {
        productions: state.productions.map(production =>
          production.id === id ? { ...production, ...updatedData } : production
        )
      };
    } catch (error) {
      console.error('Error updating production:', error);
      return { productions: state.productions };
    }
  }),
  
  deleteProduction: (id) => set((state) => {
    try {
      const { 
        recipes, 
        ingredients, 
        receipts, 
        productions, 
        updateIngredient, 
        updateReceiptItem, 
        updateProduction 
      } = get();
      
      handleDeleteProduction(
        id,
        productions,
        recipes,
        ingredients,
        receipts,
        updateIngredient,
        updateReceiptItem,
        updateProduction
      );
      
      return {
        productions: state.productions.filter(production => production.id !== id)
      };
    } catch (error) {
      console.error('Error deleting production:', error);
      return { productions: state.productions };
    }
  })
});
