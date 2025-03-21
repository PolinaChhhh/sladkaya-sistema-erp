
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  cost: number;
  quantity: number;
  lastPurchaseDate: string;
  isSemiFinal: boolean;
};

export type RecipeItem = {
  ingredientId: string;
  amount: number;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  items: RecipeItem[];
  output: number;
  outputUnit: string;
  lastProduced: string | null;
};

export type ProductionBatch = {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  cost: number;
};

export type ShippingDocument = {
  id: string;
  customer: string;
  date: string;
  items: {
    productionBatchId: string;
    quantity: number;
    price: number;
  }[];
  status: 'draft' | 'shipped' | 'delivered';
};

interface StoreState {
  ingredients: Ingredient[];
  recipes: Recipe[];
  productions: ProductionBatch[];
  shippings: ShippingDocument[];
  
  // Ingredient actions
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  
  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  
  // Production actions
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  
  // Shipping actions
  addShipping: (shipping: Omit<ShippingDocument, 'id'>) => void;
  updateShippingStatus: (id: string, status: ShippingDocument['status']) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ingredients: [],
      recipes: [],
      productions: [],
      shippings: [],
      
      addIngredient: (ingredient) => set((state) => ({
        ingredients: [...state.ingredients, { ...ingredient, id: crypto.randomUUID() }]
      })),
      
      updateIngredient: (id, data) => set((state) => ({
        ingredients: state.ingredients.map((item) => 
          item.id === id ? { ...item, ...data } : item
        )
      })),
      
      deleteIngredient: (id) => set((state) => ({
        ingredients: state.ingredients.filter((item) => item.id !== id)
      })),
      
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
      
      addShipping: (shipping) => set((state) => ({
        shippings: [...state.shippings, { ...shipping, id: crypto.randomUUID() }]
      })),
      
      updateShippingStatus: (id, status) => set((state) => ({
        shippings: state.shippings.map((shipping) => 
          shipping.id === id ? { ...shipping, status } : shipping
        )
      })),
    }),
    {
      name: 'sladkaya-sistema-storage',
    }
  )
);
