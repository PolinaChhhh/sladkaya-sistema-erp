
export type RecipeItem = {
  type?: 'ingredient' | 'recipe';
  ingredientId?: string;
  recipeId?: string;
  amount: number;
  isPackaging?: boolean;
};

export type RecipeCategory = 'semi-finished' | 'finished';

export type RecipeTag = {
  id: string;
  name: string;
  color: string;
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
  category: RecipeCategory;
  tags: RecipeTag[];
};

export type ProductionBatch = {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  cost: number;
  autoProduceSemiFinals?: boolean;
  consumptionDetails?: Record<string, any[]>; // Ingredient consumption details
  semiFinalConsumptionDetails?: Record<string, any[]>; // Semi-final consumption details
};
