
export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  cost: number;
  quantity: number;
  lastPurchaseDate: string;
  isSemiFinal: boolean;
  type: string; // We're keeping only type field
};
