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
  type?: 'ingredient' | 'recipe';
  ingredientId?: string;
  recipeId?: string;
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
  lossPercentage?: number;
};

export type ProductionBatch = {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  cost: number;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type Receipt = {
  id: string;
  supplierId: string;
  date: string;
  referenceNumber?: string;
  totalAmount: number;
  notes?: string;
  items: ReceiptItem[];
};

export type ReceiptItem = {
  id: string;
  receiptId: string;
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  remainingQuantity: number;
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
  suppliers: Supplier[];
  receipts: Receipt[];
  
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
  
  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Receipt actions
  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  updateReceipt: (id: string, data: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  addReceiptItem: (receiptId: string, item: Omit<ReceiptItem, 'id' | 'receiptId'>) => void;
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<Omit<ReceiptItem, 'id' | 'receiptId'>>) => void;
  deleteReceiptItem: (receiptId: string, itemId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ingredients: [],
      recipes: [],
      productions: [],
      shippings: [],
      suppliers: [],
      receipts: [],
      
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
      
      // Supplier actions
      addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplier, id: crypto.randomUUID() }]
      })),
      
      updateSupplier: (id, data) => set((state) => ({
        suppliers: state.suppliers.map((supplier) => 
          supplier.id === id ? { ...supplier, ...data } : supplier
        )
      })),
      
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
      })),
      
      // Receipt actions
      addReceipt: (receipt) => set((state) => {
        const newReceipt = { 
          ...receipt, 
          id: crypto.randomUUID(),
          items: receipt.items.map(item => ({
            ...item,
            id: crypto.randomUUID(),
            receiptId: crypto.randomUUID() // This will be overwritten
          }))
        };
        
        // Update all items with the correct receiptId
        newReceipt.items = newReceipt.items.map(item => ({
          ...item,
          receiptId: newReceipt.id
        }));
        
        return {
          receipts: [...state.receipts, newReceipt]
        };
      }),
      
      updateReceipt: (id, data) => set((state) => ({
        receipts: state.receipts.map((receipt) => 
          receipt.id === id ? { ...receipt, ...data } : receipt
        )
      })),
      
      deleteReceipt: (id) => set((state) => ({
        receipts: state.receipts.filter((receipt) => receipt.id !== id)
      })),
      
      addReceiptItem: (receiptId, item) => set((state) => {
        const newItem = {
          ...item,
          id: crypto.randomUUID(),
          receiptId
        };
        
        return {
          receipts: state.receipts.map(receipt => 
            receipt.id === receiptId
              ? { ...receipt, items: [...receipt.items, newItem] }
              : receipt
          )
        };
      }),
      
      updateReceiptItem: (receiptId, itemId, data) => set((state) => ({
        receipts: state.receipts.map(receipt => 
          receipt.id === receiptId
            ? {
                ...receipt,
                items: receipt.items.map(item => 
                  item.id === itemId
                    ? { ...item, ...data }
                    : item
                )
              }
            : receipt
        )
      })),
      
      deleteReceiptItem: (receiptId, itemId) => set((state) => ({
        receipts: state.receipts.map(receipt => 
          receipt.id === receiptId
            ? {
                ...receipt,
                items: receipt.items.filter(item => item.id !== itemId)
              }
            : receipt
        )
      })),
    }),
    {
      name: 'sladkaya-sistema-storage',
    }
  )
);
