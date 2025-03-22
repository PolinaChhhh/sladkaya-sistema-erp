
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Ingredient, Recipe, Supplier, Receipt, ProductionBatch, ShippingDocument, Buyer, Company } from './types';
import { createIngredientSlice, IngredientSlice } from './slices/ingredientSlice';
import { createRecipeSlice, RecipeSlice } from './slices/recipeSlice';
import { createSupplierSlice, SupplierSlice } from './slices/supplierSlice';
import { createReceiptSlice, ReceiptSlice } from './slices/receiptSlice';
import { createProductionSlice, ProductionSlice } from './slices/productionSlice';
import { createShippingSlice, ShippingSlice } from './slices/shippingSlice';
import { createBuyerSlice, BuyerSlice } from './slices/buyerSlice';
import { createCompanySlice, CompanySlice } from './slices/companySlice';

// Export all types from the types directory
export type { 
  Ingredient, 
  Recipe, 
  Supplier, 
  Receipt, 
  ReceiptItem,  
  ShippingDocument, 
  Buyer,
  ProductionBatch, 
  RecipeItem,    
  RecipeCategory, 
  RecipeTag,
  Company      
} from './types';

// Create the store combining all slices
// Use separate interfaces to avoid conflicts
interface StoreState extends 
  IngredientSlice, 
  RecipeSlice, 
  SupplierSlice, 
  ReceiptSlice, 
  ProductionSlice, 
  ShippingSlice, 
  BuyerSlice,
  CompanySlice {
  // Add loading and error states to the store
  isLoading: boolean;
  error: Error | null;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createIngredientSlice(...args),
        ...createRecipeSlice(...args),
        ...createSupplierSlice(...args),
        ...createReceiptSlice(...args),
        ...createProductionSlice(...args),
        ...createShippingSlice(...args),
        ...createBuyerSlice(...args),
        ...createCompanySlice(...args),
        // Initialize loading and error states
        isLoading: false,
        error: null
      }),
      {
        name: 'recipe-store',
        // Add storage configuration to ensure data persists properly
        partialize: (state) => ({
          ingredients: state.ingredients,
          recipes: state.recipes,
          suppliers: state.suppliers,
          receipts: state.receipts,
          productions: state.productions,
          shippings: state.shippings,
          buyers: state.buyers,
          company: state.company,
          // Don't persist these states
          isLoading: false,
          error: null
        }),
        // Ensure version is set to detect storage schema changes
        version: 1
      }
    )
  )
);
