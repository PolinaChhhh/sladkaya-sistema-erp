
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
      category: 'finished', // Всегда устанавливаем категорию как готовая продукция
      items: recipe.items.filter(item => item.type === 'ingredient') // Оставляем только ингредиенты
    }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { 
        ...recipe, 
        ...data,
        // Ensure tags is defined when updating
        tags: data.tags !== undefined ? data.tags : recipe.tags || [],
        // Убедимся, что категория всегда "finished"
        category: 'finished',
        // Если обновляем элементы, фильтруем только ингредиенты
        items: data.items ? data.items.filter(item => item.type === 'ingredient') : recipe.items
      } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
});
