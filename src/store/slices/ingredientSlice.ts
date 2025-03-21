
import { StateCreator } from 'zustand';
import { Ingredient } from '../types';

export interface IngredientSlice {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
}

export const createIngredientSlice: StateCreator<IngredientSlice> = (set) => ({
  ingredients: [],
  
  addIngredient: (ingredient) => set((state) => ({
    ingredients: [...state.ingredients, { 
      ...ingredient, 
      id: crypto.randomUUID(),
      type: ingredient.type || 'Ингредиент' // Default type is now "Ингредиент"
    }]
  })),
  
  updateIngredient: (id, data) => set((state) => ({
    ingredients: state.ingredients.map((item) => 
      item.id === id ? { ...item, ...data } : item
    )
  })),
  
  deleteIngredient: (id) => set((state) => ({
    ingredients: state.ingredients.filter((item) => item.id !== id)
  })),
});
