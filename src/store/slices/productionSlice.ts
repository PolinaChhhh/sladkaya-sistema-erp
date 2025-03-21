
import { StateCreator } from 'zustand';
import { ProductionBatch, Recipe } from '../types';
import { IngredientSlice } from './ingredientSlice';
import { ReceiptSlice } from './receiptSlice';
import { RecipeSlice } from './recipeSlice';
import { consumeIngredientsWithFifo, restoreIngredientsToReceipts } from '../utils/fifoCalculator';

export interface ProductionSlice {
  productions: ProductionBatch[];
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

type StoreWithDependencies = IngredientSlice & ReceiptSlice & RecipeSlice;

export const createProductionSlice: StateCreator<
  ProductionSlice & StoreWithDependencies,
  [],
  [],
  ProductionSlice
> = (set, get) => ({
  productions: [],
  
  addProduction: (production) => set((state) => {
    // Get recipe details
    const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
    const recipe = recipes.find(r => r.id === production.recipeId);
    
    if (!recipe) {
      console.error('Recipe not found');
      return { productions: state.productions };
    }
    
    // Calculate cost using FIFO method for direct ingredients
    let cost = consumeIngredientsWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts,
      updateIngredient,
      updateReceiptItem
    );
    
    // Handle semi-finished products in recipe
    const semiFinalCost = consumeSemiFinalProducts(
      recipe,
      production.quantity,
      recipes,
      get().productions,
      updateProduction
    );
    
    // Add semi-final cost to total cost
    cost += semiFinalCost;
    
    // Create new production with calculated cost
    const newProduction = {
      ...production,
      id: crypto.randomUUID(),
      cost: cost,
      date: new Date().toISOString()
    };
    
    // Update the lastProduced date for the recipe
    get().updateRecipe(recipe.id, { lastProduced: newProduction.date });
    
    return {
      productions: [...state.productions, newProduction]
    };
  }),
  
  updateProduction: (id, data) => set((state) => {
    const originalProduction = state.productions.find(p => p.id === id);
    
    if (!originalProduction) {
      return { productions: state.productions };
    }
    
    // If quantity changed, recalculate ingredient consumption
    if (data.quantity && data.quantity !== originalProduction.quantity) {
      const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
      const recipe = recipes.find(r => r.id === originalProduction.recipeId);
      
      if (recipe) {
        // First restore the original ingredients
        restoreIngredientsToReceipts(
          recipe,
          originalProduction.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        // Also restore semi-finished products
        restoreSemiFinalProducts(
          recipe,
          originalProduction.quantity,
          recipes,
          get().productions,
          get().updateProduction
        );
        
        // Then consume the new amount of ingredients
        let newCost = consumeIngredientsWithFifo(
          recipe,
          data.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        // And consume new amount of semi-finished products
        const semiFinalCost = consumeSemiFinalProducts(
          recipe,
          data.quantity,
          recipes,
          get().productions,
          get().updateProduction
        );
        
        // Update the cost along with other changes
        newCost += semiFinalCost;
        data.cost = newCost;
      }
    }
    
    return {
      productions: state.productions.map(production =>
        production.id === id ? { ...production, ...data } : production
      )
    };
  }),
  
  deleteProduction: (id) => set((state) => {
    const productionToDelete = state.productions.find(p => p.id === id);
    
    if (productionToDelete) {
      const { recipes, ingredients, receipts, updateIngredient, updateReceiptItem } = get();
      const recipe = recipes.find(r => r.id === productionToDelete.recipeId);
      
      if (recipe) {
        // Restore ingredients back to receipts
        restoreIngredientsToReceipts(
          recipe,
          productionToDelete.quantity,
          ingredients,
          receipts,
          updateIngredient,
          updateReceiptItem
        );
        
        // Restore semi-finished products
        restoreSemiFinalProducts(
          recipe,
          productionToDelete.quantity,
          recipes,
          get().productions,
          get().updateProduction
        );
      }
    }
    
    return {
      productions: state.productions.filter(production => production.id !== id)
    };
  })
});

// Helper function to consume semi-final products from virtual stock
function consumeSemiFinalProducts(
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[],
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): number {
  let totalSemiFinalCost = 0;
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
      
      if (semiFinalRecipe) {
        const amountNeeded = item.amount * productionRatio;
        
        // Calculate available quantity of this semi-finished product
        const availableQuantity = productions
          .filter(p => p.recipeId === semiFinalId)
          .reduce((total, p) => total + p.quantity, 0);
        
        if (availableQuantity < amountNeeded) {
          console.warn(`Not enough ${semiFinalRecipe.name} available. Need ${amountNeeded}, have ${availableQuantity}`);
          return;
        }
        
        // Consume from productions using FIFO (oldest first)
        const semiFinalProductions = [...productions]
          .filter(p => p.recipeId === semiFinalId && p.quantity > 0)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let remainingToConsume = amountNeeded;
        
        for (const prod of semiFinalProductions) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, prod.quantity);
          
          // Calculate cost for this portion
          const unitCost = prod.cost / prod.quantity;
          const consumeCost = consumeAmount * unitCost;
          
          // Add to total cost
          totalSemiFinalCost += consumeCost;
          
          // Update the production quantity
          updateProduction(prod.id, {
            quantity: prod.quantity - consumeAmount
          });
          
          remainingToConsume -= consumeAmount;
        }
      }
    });
  
  return totalSemiFinalCost;
}

// Helper function to restore semi-final products when updating or deleting a production
function restoreSemiFinalProducts(
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  productions: ProductionBatch[],
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void
): void {
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId)
    .forEach(item => {
      const semiFinalId = item.recipeId as string;
      const amountToRestore = item.amount * productionRatio;
      
      // Find the most recent production of this semi-final with quantity 0
      // We'll restore to the most recent productions first (LIFO for restoration)
      const semiFinalProductions = [...productions]
        .filter(p => p.recipeId === semiFinalId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let remainingToRestore = amountToRestore;
      
      for (const prod of semiFinalProductions) {
        if (remainingToRestore <= 0) break;
        
        // For each production, we need to determine how much was originally produced
        const originalProduction = productions.find(p => p.id === prod.id);
        if (!originalProduction) continue;
        
        // We can restore up to the original quantity
        const restoreAmount = Math.min(remainingToRestore, originalProduction.quantity - prod.quantity);
        
        if (restoreAmount > 0) {
          // Update the production quantity
          updateProduction(prod.id, {
            quantity: prod.quantity + restoreAmount
          });
          
          remainingToRestore -= restoreAmount;
        }
      }
    });
}
