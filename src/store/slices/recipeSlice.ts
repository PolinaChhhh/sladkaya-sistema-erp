
import { StateCreator } from 'zustand';
import { Recipe, ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';
import { ReceiptSlice } from './receiptSlice';
import { 
  createProduction, 
  updateProductionBatch, 
  deleteProductionBatch 
} from '../operations/productionOperations';

export interface RecipeSlice {
  recipes: Recipe[];
  productions: ProductionBatch[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

// Dependencies from other slices
type StoreWithDependencies = IngredientSlice & ReceiptSlice;

export const createRecipeSlice: StateCreator<
  RecipeSlice & StoreWithDependencies,
  [],
  [],
  RecipeSlice
> = (set, get) => ({
  recipes: [],
  productions: [],
  
  addRecipe: (recipe) => set((state) => ({
    recipes: [...state.recipes, { 
      ...recipe, 
      id: crypto.randomUUID(),
      tags: recipe.tags || [] // Ensure tags is defined
    }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { 
        ...recipe, 
        ...data,
        // Ensure tags is defined when updating
        tags: data.tags !== undefined ? data.tags : recipe.tags || []
      } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
  
  addProduction: (production) => set((state) => {
    // Use the extracted module to create a production
    const newProduction = createProduction(
      production,
      state.recipes,
      state.ingredients,
      state.receipts,
      get().updateIngredient,
      get().updateReceiptItem,
      get().updateRecipe
    );
    
    if (!newProduction) {
      return { productions: state.productions };
    }
    
    return {
      productions: [...state.productions, newProduction]
    };
  }),

  updateProduction: (id, data) => set((state) => {
    // Use the extracted module to update a production
    const updatedProductions = updateProductionBatch(
      id,
      data,
      state.productions,
      state.recipes,
      state.ingredients,
      state.receipts,
      get().updateIngredient,
      get().updateReceiptItem
    );
    
    return { productions: updatedProductions };
  }),

  deleteProduction: (id) => set((state) => {
    // Use the extracted module to delete a production
    const updatedProductions = deleteProductionBatch(
      id,
      state.productions,
      state.recipes,
      state.ingredients,
      state.receipts,
      get().updateIngredient,
      get().updateReceiptItem
    );
    
    return { productions: updatedProductions };
  }),
});
