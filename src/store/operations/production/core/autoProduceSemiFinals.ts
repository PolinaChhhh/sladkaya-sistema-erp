
import { ProductionBatch, Recipe } from '../../../types';
import { handleAddProduction } from './addProduction';
import { checkIngredientsAvailability } from '../../../utils/fifo/checkAvailability';

/**
 * Auto-produces any required semi-final products
 * 
 * @param recipe The recipe to produce
 * @param quantity The quantity to produce
 * @param semiFinalsToProduce Optional array of semi-final recipe IDs to specifically produce
 */
export const autoProduceSemiFinals = (
  recipe: Recipe,
  quantity: number,
  recipes: Recipe[],
  ingredients: any[],
  receipts: any[],
  productions: ProductionBatch[],
  updateIngredient: (id: string, data: Partial<any>) => void,
  updateReceiptItem: (receiptId: string, itemId: string, data: Partial<any>) => void,
  updateProduction: (id: string, data: Partial<ProductionBatch>) => void,
  updateRecipe: (id: string, data: Partial<Recipe>) => void,
  semiFinalsToProduce?: string[]
): void => {
  const productionRatio = quantity / recipe.output;
  
  // Find all recipe items that are semi-finished products
  const semiFinalItems = recipe.items
    .filter(item => item.type === 'recipe' && item.recipeId);
  
  // If specific semi-finals are provided, only produce those
  const itemsToProcess = semiFinalsToProduce
    ? semiFinalItems.filter(item => 
        item.recipeId && semiFinalsToProduce.includes(item.recipeId as string))
    : semiFinalItems;
  
  itemsToProcess.forEach(item => {
    const semiFinalId = item.recipeId as string;
    const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
    
    if (semiFinalRecipe) {
      const amountNeeded = item.amount * productionRatio;
      
      // Calculate available quantity of this semi-finished product
      const availableQuantity = productions
        .filter(p => p.recipeId === semiFinalId)
        .reduce((total, p) => total + p.quantity, 0);
      
      // If we don't have enough, produce more
      if (availableQuantity < amountNeeded) {
        const amountToCreate = amountNeeded - availableQuantity;
        console.log(`Auto-producing ${amountToCreate} ${semiFinalRecipe.outputUnit} of ${semiFinalRecipe.name}`);
        
        // Check if we have enough ingredients for this semi-final
        const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
          semiFinalRecipe,
          amountToCreate,
          ingredients,
          recipes,
          productions,
          false // Don't skip semi-final checks for nested semi-finals
        );
        
        if (!canProduce) {
          console.error(`Insufficient ingredients for auto-producing semi-final ${semiFinalRecipe.name}: ${insufficientIngredients.join(', ')}`);
          throw new Error(`Недостаточно ингредиентов для производства полуфабриката ${semiFinalRecipe.name}: ${insufficientIngredients.join(', ')}`);
        }
        
        // Create a new production of this semi-final product
        const semiFinalProduction: Omit<ProductionBatch, 'id'> = {
          recipeId: semiFinalId,
          quantity: amountToCreate,
          date: new Date().toISOString(),
          cost: 0, // Will be calculated in handleAddProduction
          autoProduceSemiFinals: true // Recursively auto-produce any required semi-finals
        };
        
        // Add the semi-final production
        handleAddProduction(
          semiFinalProduction,
          recipes,
          ingredients,
          receipts,
          productions,
          updateIngredient,
          updateReceiptItem,
          updateProduction,
          updateRecipe
        );
      }
    }
  });
};
