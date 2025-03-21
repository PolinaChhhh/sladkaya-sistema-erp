
import { StateCreator } from 'zustand';
import { Recipe, ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';

export interface RecipeSlice {
  recipes: Recipe[];
  productions: ProductionBatch[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
}

type StoreWithIngredientSlice = IngredientSlice;

export const createRecipeSlice: StateCreator<
  RecipeSlice & StoreWithIngredientSlice,
  [],
  [],
  RecipeSlice
> = (set, get) => ({
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
  
  addProduction: (production) => set((state) => {
    const recipe = state.recipes.find(r => r.id === production.recipeId);
    
    if (recipe) {
      // Calculate how much of each ingredient is used for this production
      const productionRatio = production.quantity / recipe.output;
      
      // Reduce ingredient quantities based on recipe items
      recipe.items.forEach(item => {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
          
          if (ingredient) {
            const amountUsed = item.amount * productionRatio;
            const newQuantity = Math.max(0, ingredient.quantity - amountUsed);
            
            get().updateIngredient(ingredient.id, {
              quantity: newQuantity
            });
          }
        }
      });
    }
    
    return {
      productions: [...state.productions, { ...production, id: crypto.randomUUID() }]
    };
  }),
});
