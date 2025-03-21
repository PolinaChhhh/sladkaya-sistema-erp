
export type ReceiptItem = {
  id: string;
  receiptId: string;
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  remainingQuantity: number;
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
