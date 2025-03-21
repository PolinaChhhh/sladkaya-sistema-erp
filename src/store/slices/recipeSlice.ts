
import { StateCreator } from 'zustand';
import { Recipe, ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';

export interface RecipeSlice {
  recipes: Recipe[];
  productions: ProductionBatch[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addProduction: (production: Omit<ProductionBatch, 'id'>) => void;
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void;
  deleteProduction: (id: string) => void;
}

type StoreWithIngredientSlice = IngredientSlice;

export const createRecipeSlice: StateCreator<
  RecipeSlice & StoreWithIngredientSlice,
  [],
  [],
  RecipeSlice
> = (set, get) => ({
  recipes: [],
  productions: [],
  
  addRecipe: (recipe) => set((state) => ({
    recipes: [...state.recipes, { ...recipe, id: crypto.randomUUID() }]
  })),
  
  updateRecipe: (id, data) => set((state) => ({
    recipes: state.recipes.map((recipe) => 
      recipe.id === id ? { ...recipe, ...data } : recipe
    )
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id)
  })),
  
  addProduction: (production) => set((state) => {
    const recipe = state.recipes.find(r => r.id === production.recipeId);
    
    if (recipe) {
      // Calculate how much of each ingredient is used for this production
      const productionRatio = production.quantity / recipe.output;
      
      // Check if we have enough of each ingredient
      let canProduce = true;
      const insufficientIngredients: string[] = [];
      
      recipe.items.forEach(item => {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
          
          if (ingredient) {
            const amountNeeded = item.amount * productionRatio;
            if (ingredient.quantity < amountNeeded) {
              canProduce = false;
              insufficientIngredients.push(ingredient.name);
            }
          }
        }
      });
      
      if (!canProduce) {
        console.error(`Cannot produce: Insufficient ingredients: ${insufficientIngredients.join(', ')}`);
        return { productions: state.productions }; // Don't add production if insufficient ingredients
      }
      
      // Reduce ingredient quantities based on recipe items
      recipe.items.forEach(item => {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
          
          if (ingredient) {
            const amountUsed = item.amount * productionRatio;
            const newQuantity = Math.max(0, ingredient.quantity - amountUsed);
            
            get().updateIngredient(ingredient.id, {
              quantity: newQuantity
            });
          }
        }
      });
      
      // Update the last produced date for the recipe
      get().updateRecipe(recipe.id, {
        lastProduced: new Date().toISOString()
      });
    }
    
    return {
      productions: [...state.productions, { ...production, id: crypto.randomUUID() }]
    };
  }),

  updateProduction: (id, data) => set((state) => {
    const originalProduction = state.productions.find(production => production.id === id);
    
    if (!originalProduction) {
      return { productions: state.productions };
    }

    // If the quantity has changed, we need to adjust the ingredient quantities
    if (data.quantity !== undefined && data.quantity !== originalProduction.quantity) {
      const recipe = state.recipes.find(r => r.id === originalProduction.recipeId);
      
      if (recipe) {
        // First, restore the ingredients used in the original production
        const originalRatio = originalProduction.quantity / recipe.output;
        
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const originalAmountUsed = item.amount * originalRatio;
              // Restore the original amount
              get().updateIngredient(ingredient.id, {
                quantity: ingredient.quantity + originalAmountUsed
              });
            }
          }
        });

        // Calculate the new ratio and check if we have enough ingredients
        const newRatio = data.quantity as number / recipe.output;
        let canProduce = true;
        const insufficientIngredients: string[] = [];
        
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const newAmountNeeded = item.amount * newRatio;
              if (ingredient.quantity < newAmountNeeded) {
                canProduce = false;
                insufficientIngredients.push(ingredient.name);
              }
            }
          }
        });
        
        if (!canProduce) {
          console.error(`Cannot update production: Insufficient ingredients: ${insufficientIngredients.join(', ')}`);
          
          // Revert the restoration since we can't update
          recipe.items.forEach(item => {
            if (item.type === 'ingredient' && item.ingredientId) {
              const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
              
              if (ingredient) {
                const originalAmountUsed = item.amount * originalRatio;
                // Take away the amount we just restored
                get().updateIngredient(ingredient.id, {
                  quantity: Math.max(0, ingredient.quantity - originalAmountUsed)
                });
              }
            }
          });
          
          return { productions: state.productions };
        }
        
        // Now consume the ingredients for the new quantity
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const newAmountUsed = item.amount * newRatio;
              const newQuantity = Math.max(0, ingredient.quantity - newAmountUsed);
              
              get().updateIngredient(ingredient.id, {
                quantity: newQuantity
              });
            }
          }
        });

        // Calculate new cost based on the updated quantity
        if (data.cost === undefined) {
          const totalCost = recipe.items.reduce((sum, item) => {
            if (item.type === 'ingredient' && item.ingredientId) {
              const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
              if (ingredient) {
                return sum + (ingredient.cost * item.amount * newRatio);
              }
            }
            return sum;
          }, 0);
          
          data.cost = totalCost;
        }
      }
    }

    // Update the production with new data
    return {
      productions: state.productions.map((production) => 
        production.id === id ? { ...production, ...data } : production
      )
    };
  }),

  deleteProduction: (id) => set((state) => {
    const productionToDelete = state.productions.find(p => p.id === id);
    
    if (productionToDelete) {
      // Get the recipe for this production
      const recipe = state.recipes.find(r => r.id === productionToDelete.recipeId);
      
      if (recipe) {
        // Calculate how much of each ingredient we need to restore
        const ratio = productionToDelete.quantity / recipe.output;
        
        // Add back the ingredients used in this production
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const amountToRestore = item.amount * ratio;
              
              get().updateIngredient(ingredient.id, {
                quantity: ingredient.quantity + amountToRestore
              });
            }
          }
        });
      }
    }
    
    // Remove the production
    return {
      productions: state.productions.filter((production) => production.id !== id)
    };
  }),
});
