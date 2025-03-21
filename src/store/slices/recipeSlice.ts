
import { StateCreator } from 'zustand';
import { Recipe } from '../types';

export interface RecipeSlice {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
}

// Dependencies from other slices
type StoreWithDependencies = Record<string, any>;

export const createRecipeSlice: StateCreator<
  RecipeSlice & StoreWithDependencies,
  [],
  [],
  RecipeSlice
> = (set, get) => ({
  recipes: [],
  
  addRecipe: (recipe) => set((state) => ({
    recipes: [...state.recipes, { 
      ...recipe, 
      id: crypto.randomUUID(),
      tags: recipe.tags || [], // Ensure tags is defined
      category: 'finished', // Always set category as finished
      items: recipe.items.filter(item => item.type === 'ingredient') // Keep only ingredients
    }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { 
        ...recipe, 
        ...data,
        // Ensure tags is defined when updating
        tags: data.tags !== undefined ? data.tags : recipe.tags || [],
        // Ensure category is always "finished"
        category: 'finished',
        // If updating items, filter only ingredients
        items: data.items ? data.items.filter(item => item.type === 'ingredient') : recipe.items
      } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
});
