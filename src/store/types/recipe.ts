
export type RecipeItem = {
  type?: 'ingredient' | 'recipe';
  ingredientId?: string;
  recipeId?: string;
  amount: number;
  isPackaging?: boolean;
};

// Changed from union type to single string literal type
export type RecipeCategory = 'finished';

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
  lossPercentage?: number; // Keep as optional for backward compatibility
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
  consumptionDetails?: Record<string, any[]>; // Generic consumption details that can store both ingredient and semi-final consumption
};
