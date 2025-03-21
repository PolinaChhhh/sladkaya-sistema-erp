
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

export interface SemiFinalIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  cost: number;
  fifoDetails?: FifoDetail[];
}

export interface SemiFinalFifoDetail {
  productionId: string;
  date: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface SemiFinalUsage {
  recipeId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  ingredients: SemiFinalIngredient[];
  fifoDetails?: SemiFinalFifoDetail[];
}
