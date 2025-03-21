
// Re-export all types from their respective files
export * from './ingredient';
export * from './receipt';
export * from './recipe';
export * from './supplier';
export * from './buyer';
export * from './shipping';

// Production types

export interface ConsumedReceiptItem {
  receiptId: string;
  itemId: string;
  amount: number;
  unitPrice: number;
  date: string;
  referenceNumber?: string;
}

export interface ProductionBatch {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  cost: number;
  autoProduceSemiFinals: boolean;
  consumptionDetails?: Record<string, ConsumedReceiptItem[]>;
}
