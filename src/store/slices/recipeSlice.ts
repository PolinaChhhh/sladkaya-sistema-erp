
import { StateCreator } from 'zustand';
import { Recipe, ProductionBatch } from '../types';
import { IngredientSlice } from './ingredientSlice';
import { ReceiptSlice } from './receiptSlice';

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

// Update the type to include ReceiptSlice
type StoreWithDependencies = IngredientSlice & ReceiptSlice;

export const createRecipeSlice: StateCreator<
  RecipeSlice & StoreWithDependencies,
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
      
      // Calculate total cost using FIFO method
      let totalCost = 0;
      
      // Reduce ingredient quantities based on recipe items using FIFO
      recipe.items.forEach(item => {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
          
          if (ingredient) {
            const amountNeeded = item.amount * productionRatio;
            let remainingToConsume = amountNeeded;
            let ingredientCost = 0;
            
            // Get all receipt items for this ingredient, sorted by date (oldest first)
            const { receipts } = get();
            
            // Flatten all receipt items for this ingredient and sort by date
            const allReceiptItems = receipts
              .flatMap(receipt => receipt.items
                .filter(item => item.ingredientId === ingredient.id && item.remainingQuantity > 0)
                .map(item => ({
                  ...item,
                  receiptDate: receipt.date
                }))
              )
              .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
            
            // Consume from oldest receipt items first (FIFO)
            for (const receiptItem of allReceiptItems) {
              if (remainingToConsume <= 0) break;
              
              const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
              
              // Calculate the cost for this portion using the receipt's unit price
              ingredientCost += consumeAmount * receiptItem.unitPrice;
              
              // Reduce the remaining amount from this receipt item
              get().updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
                remainingQuantity: receiptItem.remainingQuantity - consumeAmount
              });
              
              remainingToConsume -= consumeAmount;
            }
            
            // Add the cost of this ingredient to the total cost
            totalCost += ingredientCost;
            
            // Update the ingredient quantity
            get().updateIngredient(ingredient.id, {
              quantity: Math.max(0, ingredient.quantity - amountNeeded)
            });
          }
        }
      });
      
      // Update the cost with the calculated FIFO cost
      const newProduction = {
        ...production,
        cost: totalCost,
        id: crypto.randomUUID()
      };
      
      // Update the last produced date for the recipe
      get().updateRecipe(recipe.id, {
        lastProduced: new Date().toISOString()
      });
      
      return {
        productions: [...state.productions, newProduction]
      };
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
        // This is more complex with FIFO, as we don't know exactly which receipt items were used
        // For simplicity, we'll restore the ingredients to the latest receipts
        const originalRatio = originalProduction.quantity / recipe.output;
        
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const originalAmountUsed = item.amount * originalRatio;
              
              // Restore the original amount to the ingredient
              get().updateIngredient(ingredient.id, {
                quantity: ingredient.quantity + originalAmountUsed
              });
              
              // Find the most recent receipt items for this ingredient
              const { receipts } = get();
              const receiptItems = receipts
                .flatMap(receipt => receipt.items
                  .filter(item => item.ingredientId === ingredient.id)
                  .map(item => ({
                    ...item,
                    receiptDate: receipt.date
                  }))
                )
                .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime());
              
              // Restore the amount to the most recent receipts
              let remainingToRestore = originalAmountUsed;
              for (const receiptItem of receiptItems) {
                if (remainingToRestore <= 0) break;
                
                const restoreAmount = Math.min(remainingToRestore, receiptItem.quantity);
                
                get().updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
                  remainingQuantity: receiptItem.remainingQuantity + restoreAmount
                });
                
                remainingToRestore -= restoreAmount;
              }
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
        
        // Calculate new cost using FIFO
        let totalCost = 0;
        
        // Now consume the ingredients for the new quantity using FIFO
        recipe.items.forEach(item => {
          if (item.type === 'ingredient' && item.ingredientId) {
            const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
            
            if (ingredient) {
              const amountNeeded = item.amount * newRatio;
              let remainingToConsume = amountNeeded;
              let ingredientCost = 0;
              
              // Get all receipt items for this ingredient, sorted by date (oldest first)
              const { receipts } = get();
              
              // Flatten all receipt items for this ingredient and sort by date
              const allReceiptItems = receipts
                .flatMap(receipt => receipt.items
                  .filter(item => item.ingredientId === ingredient.id && item.remainingQuantity > 0)
                  .map(item => ({
                    ...item,
                    receiptDate: receipt.date
                  }))
                )
                .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
              
              // Consume from oldest receipt items first (FIFO)
              for (const receiptItem of allReceiptItems) {
                if (remainingToConsume <= 0) break;
                
                const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
                
                // Calculate the cost for this portion using the receipt's unit price
                ingredientCost += consumeAmount * receiptItem.unitPrice;
                
                // Reduce the remaining amount from this receipt item
                get().updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
                  remainingQuantity: receiptItem.remainingQuantity - consumeAmount
                });
                
                remainingToConsume -= consumeAmount;
              }
              
              // Add the cost of this ingredient to the total cost
              totalCost += ingredientCost;
              
              // Update the ingredient quantity
              get().updateIngredient(ingredient.id, {
                quantity: Math.max(0, ingredient.quantity - amountNeeded)
              });
            }
          }
        });

        // Update the cost with our calculated FIFO cost
        data.cost = totalCost;
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
              
              // Restore the ingredient quantity
              get().updateIngredient(ingredient.id, {
                quantity: ingredient.quantity + amountToRestore
              });
              
              // For deleted productions, we'll restore to the newest receipt items
              // This is a simplification, as we can't know exactly which receipt items were used
              const { receipts } = get();
              const receiptItems = receipts
                .flatMap(receipt => receipt.items
                  .filter(item => item.ingredientId === ingredient.id)
                  .map(item => ({
                    ...item,
                    receiptDate: receipt.date
                  }))
                )
                .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime());
              
              let remainingToRestore = amountToRestore;
              for (const receiptItem of receiptItems) {
                if (remainingToRestore <= 0) break;
                
                // We can't restore more than was originally in the receipt
                const originalTotal = receiptItem.quantity;
                const currentRemaining = receiptItem.remainingQuantity;
                const consumed = originalTotal - currentRemaining;
                
                const restoreAmount = Math.min(remainingToRestore, consumed);
                
                if (restoreAmount > 0) {
                  get().updateReceiptItem(receiptItem.receiptId, receiptItem.id, {
                    remainingQuantity: currentRemaining + restoreAmount
                  });
                  
                  remainingToRestore -= restoreAmount;
                }
              }
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
