
import { StateCreator } from 'zustand';
import { Receipt, ReceiptItem } from '../types';

export interface ReceiptSlice {
  receipts: Receipt[];
  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  updateReceipt: (id: string, data: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  addReceiptItem: (receiptId: string, item: Omit<ReceiptItem, 'id' | 'receiptId'>) => void;
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<Omit<ReceiptItem, 'id' | 'receiptId'>>) => void;
  deleteReceiptItem: (receiptId: string, itemId: string) => void;
}

export const createReceiptSlice: StateCreator<ReceiptSlice> = (set) => ({
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
});
