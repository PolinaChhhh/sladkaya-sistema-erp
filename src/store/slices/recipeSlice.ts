
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
      // Keep category as provided, defaulting to 'finished' if not specified
      category: recipe.category || 'finished',
      items: recipe.items || [], // Ensure items is defined
      imageUrl: recipe.imageUrl || undefined, // Handle imageUrl
      preparationTime: recipe.preparationTime || undefined // Handle preparationTime
    }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { 
        ...recipe, 
        ...data,
        // Ensure tags is defined when updating
        tags: data.tags !== undefined ? data.tags : recipe.tags || [],
        // Keep category as specified in the data or use the existing one
        category: data.category || recipe.category,
        // Keep items as provided
        items: data.items !== undefined ? data.items : recipe.items,
        // Handle imageUrl updating
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : recipe.imageUrl,
        // Handle preparationTime updating
        preparationTime: data.preparationTime !== undefined ? data.preparationTime : recipe.preparationTime
      } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
});
