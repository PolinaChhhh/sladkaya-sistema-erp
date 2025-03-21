
export interface FifoDetail {
  receiptId: string;
  referenceNumber?: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IngredientUsage {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: FifoDetail[];
}
