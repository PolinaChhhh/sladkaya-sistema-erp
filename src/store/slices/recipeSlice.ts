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
      items: recipe.items.filter(item => 
        // For finished products, only allow ingredients
        recipe.category === 'finished' 
          ? item.type === 'ingredient' && !item.isPackaging
          : !item.isPackaging // For semi-finished, allow both ingredients and recipes
      ) 
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
        // Filter items appropriately based on category
        items: data.items ? data.items.filter(item => 
          (recipe.category === 'finished' || data.category === 'finished')
            ? item.type === 'ingredient' && !item.isPackaging
            : !item.isPackaging // For semi-finished, allow both ingredients and recipes
        ) : recipe.items
      } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
});
