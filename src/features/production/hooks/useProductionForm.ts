
import { useState } from 'react';
import { useStore } from '@/store/recipeStore';
import { ProductionBatch } from '@/store/types';
import { toast } from 'sonner';
import { checkIngredientsAvailability } from '@/store/utils/fifo/checkAvailability';

export interface ProductionFormData {
  recipeId: string;
  quantity: number;
  date: string;
  autoProduceSemiFinals: boolean;
  semiFinalsToProduce?: string[]; // Add this new field
}

export const useProductionForm = () => {
  const { recipes, ingredients, productions, addProduction, updateProduction } = useStore();
  
  const [createFormData, setCreateFormData] = useState<ProductionFormData>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: true,  // Default to true so semi-finals are auto-produced
    semiFinalsToProduce: []       // Initialize as empty array
  });
  
  const [editFormData, setEditFormData] = useState<ProductionFormData>({
    recipeId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: true,  // Default to true so semi-finals are auto-produced
    semiFinalsToProduce: []       // Initialize as empty array
  });
  
  const handleCreateProduction = () => {
    const recipe = recipes.find(r => r.id === createFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return false;
    }
    
    if (createFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // First, check if there are enough ingredients for all required semi-finals
    if (createFormData.autoProduceSemiFinals && 
        createFormData.semiFinalsToProduce && 
        createFormData.semiFinalsToProduce.length > 0) {
      
      for (const semiFinalId of createFormData.semiFinalsToProduce) {
        const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
        if (!semiFinalRecipe) continue;
        
        // Find how much of this semi-final is needed
        const semiFinalItem = recipe.items.find(item => 
          item.type === 'recipe' && item.recipeId === semiFinalId
        );
        
        if (!semiFinalItem) continue;
        
        // Calculate required amount based on production ratio
        const ratio = createFormData.quantity / recipe.output;
        const amountNeeded = semiFinalItem.amount * ratio;
        
        // Check if we have enough ingredients for this semi-final
        const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
          semiFinalRecipe,
          amountNeeded,
          ingredients,
          recipes,
          productions,
          false // Don't skip semi-final checks for nested semi-finals
        );
        
        if (!canProduce) {
          toast.error(`Недостаточно ингредиентов для производства полуфабриката ${semiFinalRecipe.name}: ${insufficientIngredients.join(', ')}`);
          return false;
        }
      }
      
      // Now produce the semi-finals
      createFormData.semiFinalsToProduce.forEach(semiFinalId => {
        const semiFinalRecipe = recipes.find(r => r.id === semiFinalId);
        if (!semiFinalRecipe) return;
        
        // Find how much of this semi-final is needed
        const semiFinalItem = recipe.items.find(item => 
          item.type === 'recipe' && item.recipeId === semiFinalId
        );
        
        if (!semiFinalItem) return;
        
        // Calculate required amount based on production ratio
        const ratio = createFormData.quantity / recipe.output;
        const amountNeeded = semiFinalItem.amount * ratio;
        
        // Create the semi-final production
        addProduction({
          recipeId: semiFinalId,
          quantity: amountNeeded,
          date: new Date(createFormData.date).toISOString(),
          cost: 0, // This will be calculated by the store
          autoProduceSemiFinals: true // Allow nested semi-finals to be auto-produced too
        });
        
        toast.success(`Полуфабрикат ${semiFinalRecipe.name} успешно произведен`);
      });
    }
    
    // Check if we have enough ingredients and semi-finished products for the main recipe
    const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
      recipe,
      createFormData.quantity,
      ingredients,
      recipes,
      productions,
      createFormData.autoProduceSemiFinals // Skip semi-final checks if we're auto-producing
    );
    
    if (!canProduce) {
      toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
      return false;
    }
    
    // Create the main production
    addProduction({
      recipeId: createFormData.recipeId,
      quantity: createFormData.quantity,
      date: new Date(createFormData.date).toISOString(),
      cost: 0, // This will be calculated by the store
      autoProduceSemiFinals: createFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно добавлено');
    return true;
  };
  
  const handleEditProduction = (selectedProduction: ProductionBatch | null) => {
    if (!selectedProduction) return false;
    
    const recipe = recipes.find(r => r.id === editFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return false;
    }
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return false;
    }
    
    // Check if we have enough ingredients for updated quantity
    // Only check if we're not auto-producing semi-finals and if quantity increased
    if (editFormData.quantity > selectedProduction.quantity) {
      const additionalQuantity = editFormData.quantity - selectedProduction.quantity;
      
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe,
        additionalQuantity,
        ingredients,
        recipes,
        productions,
        editFormData.autoProduceSemiFinals
      );
      
      if (!canProduce) {
        toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
        return false;
      }
    }
    
    // Update production
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: new Date(editFormData.date).toISOString(),
      autoProduceSemiFinals: editFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно обновлено');
    return true;
  };
  
  return {
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    handleCreateProduction,
    handleEditProduction
  };
};
