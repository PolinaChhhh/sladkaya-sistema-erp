
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
      type: ingredient.type || 'Ингредиент', // Default type is now "Ингредиент"
      isSemiFinal: ingredient.isSemiFinal || false // Ensure isSemiFinal has a default value
    }]
  })),
  
  updateIngredient: (id, data) => {
    // Ensure id is a string for consistent comparison
    const idStr = String(id);
    console.log(`Updating ingredient with id=${idStr}, data=`, data);
    
    set((state) => {
      // Create a new array to ensure state updates properly trigger rerenders
      const updatedIngredients = state.ingredients.map((item) => {
        if (String(item.id) === idStr) {
          // Create a new object with the updates to ensure immutability
          const updatedItem = { ...item, ...data };
          console.log(`Updated ingredient ${item.name}: `, 
            `Before: quantity=${item.quantity}, `, 
            `After: quantity=${updatedItem.quantity}`);
          return updatedItem;
        }
        return item;
      });
      
      return { ingredients: updatedIngredients };
    });
  },
  
  deleteIngredient: (id) => set((state) => ({
    ingredients: state.ingredients.filter((item) => item.id !== id)
  })),
});
