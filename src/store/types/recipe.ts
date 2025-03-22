
export type RecipeItem = {
  type?: 'ingredient' | 'recipe';
  ingredientId?: string;
  recipeId?: string;
  amount: number;
  isPackaging?: boolean;
  // Track if this ingredient came from a semi-finished product for display purposes
  fromSemiFinished?: {
    recipeId: string;
    recipeName: string;
  };
};

// Changed from single string to union type to support semi-finished products
export type RecipeCategory = 'finished' | 'semi-finished';

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
  lossPercentage?: number; // Calculate automatically for semi-finished products
  category: RecipeCategory;
  tags: RecipeTag[];
  imageUrl?: string; // Add image URL field
  preparationTime?: number; // Add preparation time field (in minutes)
  bakingTemperature?: number; // Add baking temperature field (in Celsius)
  process?: string[]; // Add process steps field
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
