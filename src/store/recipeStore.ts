
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createIngredientSlice, IngredientSlice } from './slices/ingredientSlice';
import { createRecipeSlice, RecipeSlice } from './slices/recipeSlice';
import { createShippingSlice, ShippingSlice } from './slices/shippingSlice';
import { createSupplierSlice, SupplierSlice } from './slices/supplierSlice';
import { createReceiptSlice, ReceiptSlice } from './slices/receiptSlice';

// Re-export all types from the central location
export * from './types';

// Combined store state type
type StoreState = IngredientSlice & RecipeSlice & ShippingSlice & SupplierSlice & ReceiptSlice;

// Create the store with all slices
export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createIngredientSlice(...a),
      ...createRecipeSlice(...a),
      ...createShippingSlice(...a),
      ...createSupplierSlice(...a),
      ...createReceiptSlice(...a),
    }),
    {
      name: 'sladkaya-sistema-storage',
    }
  )
);
