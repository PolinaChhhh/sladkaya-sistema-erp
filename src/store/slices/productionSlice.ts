
import { StateCreator } from 'zustand';
import { ProductionBatch, Recipe, Ingredient, Receipt, ReceiptItem } from '../types';
import { consumeIngredientsWithFifo } from '../utils/fifoCalculator';
import { calculateTotalProductionCost } from '@/features/production/utils/productionCalculator';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => { error?: boolean; insufficientItems?: Array<{name: string, required: number, available: number, unit: string}> };
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

export const createProductionSlice: StateCreator<
  ProductionSlice & {
    recipes: Recipe[];
    ingredients: Ingredient[];
    receipts: Receipt[];
    updateIngredient: (id: string, data: Partial<Ingredient>) => void;
    updateReceiptItem: (receiptId: string, itemId: string, data: Partial<ReceiptItem>) => void;
    updateRecipe: (id: string, data: Partial<Recipe>) => void;
  }
> = (set, get) => ({
  productions: [],
  
  addProduction: (production) => {
    const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem, updateRecipe } = get();
    
    const recipe = recipes.find(r => r.id === production.recipeId);
    if (!recipe) {
      return { error: true, insufficientItems: [] };
    }
    
    // Update the last produced date for the recipe
    updateRecipe(recipe.id, {
      lastProduced: new Date().toISOString()
    });
    
    // Calculate production ratio (how much of each ingredient is needed)
    const productionRatio = production.quantity / recipe.output;
    
    // Check if we have enough of each ingredient
    const insufficientItems: Array<{name: string, required: number, available: number, unit: string}> = [];
    
    // Check ingredient availability
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (ingredient) {
          const requiredAmount = item.amount * productionRatio;
          if (ingredient.quantity < requiredAmount) {
            insufficientItems.push({
              name: ingredient.name,
              required: requiredAmount,
              available: ingredient.quantity,
              unit: ingredient.unit
            });
          }
        }
      }
    });
    
    // If we don't have enough ingredients, return error
    if (insufficientItems.length > 0) {
      return { error: true, insufficientItems };
    }
    
    // Calculate the total production cost using the proper cost calculator
    const totalCost = calculateTotalProductionCost(
      production.recipeId,
      production.quantity,
      recipes,
      ingredients,
      receipts,
      get().productions
    );
    
    // Consume ingredients using FIFO method
    consumeIngredientsWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Add the production with calculated cost
    const newProduction = {
      ...production,
      cost: totalCost,
      id: crypto.randomUUID()
    };
    
    set((state) => ({
      productions: [...state.productions, newProduction]
    }));
    
    return {};
  },
  
  updateProduction: (id, data) => set((state) => ({
    productions: state.productions.map((prod) => 
      prod.id === id ? { ...prod, ...data } : prod
    )
  })),
  
  deleteProduction: (id) => set((state) => ({
    productions: state.productions.filter((prod) => prod.id !== id)
  })),
});
