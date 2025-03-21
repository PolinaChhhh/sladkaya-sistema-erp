
import { StateCreator } from 'zustand';
import { Receipt, ReceiptItem } from '../types';
import { IngredientSlice } from './ingredientSlice';

export interface ReceiptSlice {
  receipts: Receipt[];
  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  updateReceipt: (id: string, data: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  addReceiptItem: (receiptId: string, item: Omit<ReceiptItem, 'id' | 'receiptId'>) => void;
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<Omit<ReceiptItem, 'id' | 'receiptId'>>) => void;
  deleteReceiptItem: (receiptId: string, itemId: string) => void;
}

type StoreWithIngredientSlice = IngredientSlice;

export const createReceiptSlice: StateCreator<
  ReceiptSlice & StoreWithIngredientSlice, 
  [], 
  [], 
  ReceiptSlice
> = (set, get) => ({
  receipts: [],
  
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
    
    // Update ingredient quantities and prices based on receipt items
    newReceipt.items.forEach(item => {
      const { ingredientId, quantity, unitPrice } = item;
      const existingIngredient = state.ingredients.find(ing => ing.id === ingredientId);
      
      if (existingIngredient) {
        get().updateIngredient(ingredientId, {
          quantity: existingIngredient.quantity + quantity,
          cost: unitPrice, // Update to the latest price
          lastPurchaseDate: new Date().toISOString()
        });
      }
    });
    
    return {
      receipts: [...state.receipts, newReceipt]
    };
  }),
  
  updateReceipt: (id, data) => set((state) => {
    const originalReceipt = state.receipts.find(receipt => receipt.id === id);
    
    if (!originalReceipt) {
      return { receipts: state.receipts };
    }
    
    // If items have changed, update ingredient quantities
    if (data.items && originalReceipt) {
      // First, revert the original quantities from all items in the original receipt
      originalReceipt.items.forEach(originalItem => {
        const existingIngredient = state.ingredients.find(ing => ing.id === originalItem.ingredientId);
        if (existingIngredient) {
          get().updateIngredient(originalItem.ingredientId, {
            quantity: Math.max(0, existingIngredient.quantity - originalItem.quantity)
          });
        }
      });
      
      // Then, add the new quantities from the updated receipt items
      data.items.forEach(newItem => {
        const existingIngredient = state.ingredients.find(ing => ing.id === newItem.ingredientId);
        if (existingIngredient) {
          get().updateIngredient(newItem.ingredientId, {
            quantity: existingIngredient.quantity + newItem.quantity,
            cost: newItem.unitPrice, // Update to the latest price
            lastPurchaseDate: new Date().toISOString()
          });
        }
      });
    }
    
    return {
      receipts: state.receipts.map((receipt) => 
        receipt.id === id ? { ...receipt, ...data } : receipt
      )
    };
  }),
  
  deleteReceipt: (id) => set((state) => {
    const receiptToDelete = state.receipts.find(receipt => receipt.id === id);
    
    // Revert ingredient quantities for deleted receipt
    if (receiptToDelete) {
      receiptToDelete.items.forEach(item => {
        const existingIngredient = state.ingredients.find(ing => ing.id === item.ingredientId);
        if (existingIngredient) {
          get().updateIngredient(item.ingredientId, {
            quantity: Math.max(0, existingIngredient.quantity - item.quantity)
          });
        }
      });
    }
    
    return {
      receipts: state.receipts.filter((receipt) => receipt.id !== id)
    };
  }),
  
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
});
