
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Ingredient, Recipe, Supplier, Receipt, ProductionBatch, ShippingDocument, Buyer } from './types';
import { createIngredientSlice, IngredientSlice } from './slices/ingredientSlice';
import { createRecipeSlice, RecipeSlice } from './slices/recipeSlice';
import { createSupplierSlice, SupplierSlice } from './slices/supplierSlice';
import { createReceiptSlice, ReceiptSlice } from './slices/receiptSlice';
import { createProductionSlice, ProductionSlice } from './slices/productionSlice';
import { createShippingSlice, ShippingSlice } from './slices/shippingSlice';
import { createBuyerSlice, BuyerSlice } from './slices/buyerSlice';

// Export all types from the types directory
export type { 
  Ingredient, 
  Recipe, 
  Supplier, 
  Receipt, 
  ReceiptItem,  // Add ReceiptItem export
  ShippingDocument, 
  Buyer,
  ProductionBatch, 
  RecipeItem,    // Add RecipeItem export
  RecipeCategory, // Add RecipeCategory export
  RecipeTag      // Add RecipeTag export
} from './types';

// Create the store combining all slices
interface StoreState extends IngredientSlice, RecipeSlice, SupplierSlice, ReceiptSlice, ProductionSlice, ShippingSlice, BuyerSlice {}

export const useStore = create<StoreState>()((...args) => ({
  ...createIngredientSlice(...args),
  ...createRecipeSlice(...args),
  ...createSupplierSlice(...args),
  ...createReceiptSlice(...args),
  ...createProductionSlice(...args),
  ...createShippingSlice(...args),
  ...createBuyerSlice(...args),
}));
