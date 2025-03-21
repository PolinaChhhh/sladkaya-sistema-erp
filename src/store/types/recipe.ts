
export type RecipeItem = {
  type?: 'ingredient' | 'recipe';
  ingredientId?: string;
  recipeId?: string;
  amount: number;
};

export type RecipeCategory = 'semi-finished' | 'finished';

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
};

export type ProductionBatch = {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  cost: number;
};
