
import { StateCreator } from 'zustand';
import { Recipe, ProductionBatch } from '../types';

export interface RecipeSlice {
  recipes: Recipe[];
  productions: ProductionBatch[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
}

export const createRecipeSlice: StateCreator<RecipeSlice> = (set) => ({
  recipes: [],
  productions: [],
  
  addRecipe: (recipe) => set((state) => ({
    recipes: [...state.recipes, { ...recipe, id: crypto.randomUUID() }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { ...recipe, ...data } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
  
  addProduction: (production) => set((state) => ({
    productions: [...state.productions, { ...production, id: crypto.randomUUID() }]
  })),
});
