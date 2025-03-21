
import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '@/store/recipeStore';
import { toast } from 'sonner';
import { ProductionBatch } from '@/store/types';

export const useProductionState = () => {
  const { recipes, ingredients, productions, addProduction, updateProduction, deleteProduction, updateRecipe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
  const [formData, setFormData] = useState<{
    recipeId: string;
    quantity: number;
    date: string;
  }>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const [editFormData, setEditFormData] = useState<{
    quantity: number;
    date: string;
  }>({
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const filteredProductions = productions.filter(production => {
    const recipe = recipes.find(r => r.id === production.recipeId);
    return recipe?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort productions by date (newest first)
  const sortedProductions = [...filteredProductions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // This function will be used only for estimation during form entry
  // Actual FIFO calculation happens in the store slices
  const calculateCost = (recipeId: string, quantity: number): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    const recipeItems = recipe.items;
    let totalCost = 0;
    
    // Calculate production ratio
    const productionRatio = quantity / recipe.output;
    
    recipeItems.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (!ingredient) return;
        
        const amountNeeded = item.amount * productionRatio;
        
        // For the estimate, we'll use a weighted average price from receipts with remaining quantities
        const { receipts } = useStore.getState();
        
        const allReceiptItems = receipts
          .flatMap(receipt => receipt.items
            .filter(ri => ri.ingredientId === item.ingredientId && ri.remainingQuantity > 0)
            .map(ri => ({
              ...ri,
              receiptDate: receipt.date
            }))
          )
          .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
        
        let costForIngredient = 0;
        let remainingToConsume = amountNeeded;
        
        // Simulate FIFO consumption for cost estimation
        for (const receiptItem of allReceiptItems) {
          if (remainingToConsume <= 0) break;
          
          const consumeAmount = Math.min(remainingToConsume, receiptItem.remainingQuantity);
          costForIngredient += consumeAmount * receiptItem.unitPrice;
          remainingToConsume -= consumeAmount;
        }
        
        // If we couldn't find enough in receipts, use the current ingredient cost for the rest
        if (remainingToConsume > 0) {
          costForIngredient += remainingToConsume * ingredient.cost;
        }
        
        totalCost += costForIngredient;
      }
    });
    
    return totalCost;
  };
  
  const handleCreateProduction = () => {
    if (!formData.recipeId) {
      toast.error('Выберите рецепт');
      return;
    }
    
    if (formData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // Check if we have enough ingredients for production
    const recipe = recipes.find(r => r.id === formData.recipeId);
    if (recipe) {
      const productionRatio = formData.quantity / recipe.output;
      let insufficientIngredients = [];
      
      for (const item of recipe.items) {
        if (item.type === 'ingredient' && item.ingredientId) {
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (ingredient) {
            const requiredAmount = item.amount * productionRatio;
            if (ingredient.quantity < requiredAmount) {
              insufficientIngredients.push({
                name: ingredient.name,
                required: requiredAmount,
                available: ingredient.quantity,
                unit: ingredient.unit
              });
            }
          }
        }
      }
      
      if (insufficientIngredients.length > 0) {
        const warningMessage = insufficientIngredients.map(ing => 
          `${ing.name}: требуется ${ing.required.toFixed(2)} ${ing.unit}, доступно ${ing.available.toFixed(2)} ${ing.unit}`
        ).join('\n');
        
        toast.error(`Недостаточно ингредиентов:\n${warningMessage}`);
        return;
      }
    }
    
    // The cost will be calculated in the store using FIFO
    // This is just an estimate for display
    const estimatedCost = calculateCost(formData.recipeId, formData.quantity);
    
    addProduction({
      recipeId: formData.recipeId,
      quantity: formData.quantity,
      date: formData.date,
      cost: estimatedCost, // The actual cost will be recalculated in the store using FIFO
    });
    
    toast.success('Запись о производстве добавлена');
    setIsCreateDialogOpen(false);
  };
  
  const handleEditProduction = () => {
    if (!selectedProduction) return;
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // The cost will be recalculated in the store based on FIFO
    // This is just an estimate for display
    const estimatedCost = calculateCost(selectedProduction.recipeId, editFormData.quantity);
    
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: editFormData.date,
      cost: estimatedCost, // The actual cost will be recalculated in the store using FIFO
    });
    
    toast.success('Запись о производстве обновлена');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProduction = () => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    
    toast.success('Запись о производстве удалена');
    setIsDeleteDialogOpen(false);
  };
  
  const openEditDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setEditFormData({
      quantity: production.quantity,
      date: production.date,
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDeleteDialogOpen(true);
  };
  
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  return {
    searchQuery,
    setSearchQuery,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    formData,
    setFormData,
    editFormData,
    setEditFormData,
    selectedProduction,
    sortedProductions,
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    openEditDialog,
    openDeleteDialog,
    calculateCost,
    getRecipeName,
    getRecipeOutput
  };
};
