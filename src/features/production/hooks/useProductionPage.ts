
import { useState, useMemo, useEffect } from 'react';
import { useStore, Recipe, ProductionBatch, Ingredient, RecipeItem } from '@/store/recipeStore';
import { calculateIngredientsNeeded, checkIngredientsAvailability } from '@/store/utils/fifoCalculator';
import { toast } from 'sonner';

export interface ProductionFormData {
  recipeId: string;
  quantity: number;
  date: string;
  autoProduceSemiFinals: boolean;
}

interface IngredientUsageDetail {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: {
    receiptId: string;
    referenceNumber?: string;
    date: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

interface SemiFinalBreakdown {
  recipeId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  ingredients: {
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
    cost: number;
  }[];
}

export const useProductionPage = () => {
  const { 
    productions, 
    recipes, 
    ingredients, 
    receipts,
    addProduction, 
    updateProduction, 
    deleteProduction 
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<ProductionBatch | null>(null);
  
  const [createFormData, setCreateFormData] = useState<ProductionFormData>({
    recipeId: recipes.length > 0 ? recipes[0].id : '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: false
  });
  
  const [editFormData, setEditFormData] = useState<ProductionFormData>({
    recipeId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    autoProduceSemiFinals: false
  });
  
  // Update createFormData when recipes change (for initial load)
  useEffect(() => {
    if (recipes.length > 0 && createFormData.recipeId === '') {
      setCreateFormData(prevState => ({
        ...prevState,
        recipeId: recipes[0].id
      }));
    }
  }, [recipes, createFormData.recipeId]);
  
  // Filter productions by search query
  const filteredProductions = useMemo(() => {
    return productions
      .filter(production => {
        if (!searchQuery.trim()) return true;
        
        const recipe = recipes.find(r => r.id === production.recipeId);
        if (!recipe) return false;
        
        return recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [productions, recipes, searchQuery]);
  
  // Utility functions
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : 'Неизвестный рецепт';
  };
  
  const getRecipeOutput = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.outputUnit : '';
  };

  const getSelectedRecipe = (): Recipe | null => {
    if (!selectedProduction) return null;
    return recipes.find(r => r.id === selectedProduction.recipeId) || null;
  };
  
  const calculateCost = (recipe: Recipe, quantity: number): number => {
    // Sum up the cost of all ingredients
    let totalCost = 0;
    const ratio = quantity / recipe.output;
    
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (ingredient) {
          totalCost += ingredient.cost * item.amount * ratio;
        }
      } else if (item.type === 'recipe' && item.recipeId) {
        // For semi-finals, recursively calculate their cost
        const semiRecipe = recipes.find(r => r.id === item.recipeId);
        if (semiRecipe) {
          const semiCost = calculateCost(semiRecipe, 1); // Cost for one unit
          totalCost += semiCost * item.amount * ratio;
        }
      }
    });
    
    return totalCost;
  };
  
  const getIngredientDetails = (recipes: Recipe[], recipeId: string, quantity: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    const ratio = quantity / recipe.output;
    const details: {
      ingredientId: string;
      name: string;
      amount: number;
      unit: string;
      cost: number;
    }[] = [];
    
    // Process each recipe item
    recipe.items.forEach(item => {
      if (item.type === 'ingredient' && item.ingredientId) {
        const ingredient = ingredients.find(i => i.id === item.ingredientId);
        if (ingredient) {
          details.push({
            ingredientId: item.ingredientId,
            name: ingredient.name,
            amount: item.amount * ratio,
            unit: ingredient.unit,
            cost: item.amount * ratio * ingredient.cost
          });
        }
      } else if (item.type === 'recipe' && item.recipeId) {
        // For semi-finals, recursively get their ingredients
        const semiRecipe = recipes.find(r => r.id === item.recipeId);
        if (semiRecipe) {
          const semiDetails = getIngredientDetails(
            recipes, 
            item.recipeId, 
            item.amount * ratio
          );
          details.push(...semiDetails);
        }
      }
    });
    
    return details;
  };
  
  const getIngredientUsageDetails = (
    recipeId: string, 
    quantity: number
  ): IngredientUsageDetail[] => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    const ratio = quantity / recipe.output;
    const usageDetails: IngredientUsageDetail[] = [];
    
    // Get all ingredients used in this recipe
    recipe.items
      .filter(item => item.type === 'ingredient' && item.ingredientId)
      .forEach(item => {
        const ingredientId = item.ingredientId as string;
        const ingredient = ingredients.find(i => i.id === ingredientId);
        
        if (ingredient) {
          const amountNeeded = item.amount * ratio;
          
          // Find all receipts that include this ingredient and extract FIFO details
          const fifoDetails = receipts
            .filter(receipt => receipt.items.some(i => i.ingredientId === ingredientId))
            .flatMap(receipt => {
              return receipt.items
                .filter(i => i.ingredientId === ingredientId)
                .map(i => ({
                  receiptId: receipt.id,
                  referenceNumber: receipt.referenceNumber,
                  date: receipt.date,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                  totalPrice: i.quantity * i.unitPrice
                }));
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          usageDetails.push({
            ingredientId,
            name: ingredient.name,
            totalAmount: amountNeeded,
            unit: ingredient.unit,
            totalCost: amountNeeded * ingredient.cost,
            fifoDetails
          });
        }
      });
    
    return usageDetails;
  };
  
  const getSemiFinalBreakdown = (
    recipeId: string, 
    quantity: number
  ): SemiFinalBreakdown[] => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    const ratio = quantity / recipe.output;
    const breakdown: SemiFinalBreakdown[] = [];
    
    // Find all semi-final recipes used
    recipe.items
      .filter(item => item.type === 'recipe' && item.recipeId)
      .forEach(item => {
        const semiRecipeId = item.recipeId as string;
        const semiRecipe = recipes.find(r => r.id === semiRecipeId);
        
        if (semiRecipe) {
          const semiAmount = item.amount * ratio;
          const semiCost = calculateCost(semiRecipe, semiAmount);
          
          // Get ingredients for this semi-final
          const semiIngredients = semiRecipe.items
            .filter(si => si.type === 'ingredient' && si.ingredientId)
            .map(si => {
              const semiIngredientId = si.ingredientId as string;
              const semiIngredient = ingredients.find(i => i.id === semiIngredientId);
              
              if (semiIngredient) {
                const semiRatio = semiAmount / semiRecipe.output;
                const amount = si.amount * semiRatio;
                return {
                  ingredientId: semiIngredientId,
                  name: semiIngredient.name,
                  amount,
                  unit: semiIngredient.unit,
                  cost: amount * semiIngredient.cost
                };
              }
              return null;
            })
            .filter(si => si !== null) as {
              ingredientId: string;
              name: string;
              amount: number;
              unit: string;
              cost: number;
            }[];
          
          breakdown.push({
            recipeId: semiRecipeId,
            name: semiRecipe.name,
            quantity: semiAmount,
            unit: semiRecipe.outputUnit,
            cost: semiCost,
            ingredients: semiIngredients
          });
        }
      });
    
    return breakdown;
  };
  
  // Dialog actions
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  
  const openEditDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    
    setEditFormData({
      recipeId: production.recipeId,
      quantity: production.quantity,
      date: new Date(production.date).toISOString().split('T')[0],
      autoProduceSemiFinals: production.autoProduceSemiFinals || false
    });
    
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDeleteDialogOpen(true);
  };
  
  const openDetailDialog = (production: ProductionBatch) => {
    setSelectedProduction(production);
    setIsDetailDialogOpen(true);
  };
  
  // Form submissions
  const handleCreateProduction = () => {
    const recipe = recipes.find(r => r.id === createFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return;
    }
    
    if (createFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // Check if we have enough ingredients
    const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
      recipe,
      createFormData.quantity,
      ingredients
    );
    
    if (!canProduce) {
      toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
      return;
    }
    
    // Create production
    addProduction({
      recipeId: createFormData.recipeId,
      quantity: createFormData.quantity,
      date: new Date(createFormData.date).toISOString(),
      cost: 0, // This will be calculated by the store
      autoProduceSemiFinals: createFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно добавлено');
    setIsCreateDialogOpen(false);
  };
  
  const handleEditProduction = () => {
    if (!selectedProduction) return;
    
    const recipe = recipes.find(r => r.id === editFormData.recipeId);
    
    if (!recipe) {
      toast.error('Рецепт не найден');
      return;
    }
    
    if (editFormData.quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    // Check if we have enough ingredients for updated quantity
    if (editFormData.quantity > selectedProduction.quantity) {
      const additionalQuantity = editFormData.quantity - selectedProduction.quantity;
      
      const { canProduce, insufficientIngredients } = checkIngredientsAvailability(
        recipe,
        additionalQuantity,
        ingredients
      );
      
      if (!canProduce) {
        toast.error(`Недостаточно ингредиентов: ${insufficientIngredients.join(', ')}`);
        return;
      }
    }
    
    // Update production
    updateProduction(selectedProduction.id, {
      quantity: editFormData.quantity,
      date: new Date(editFormData.date).toISOString(),
      autoProduceSemiFinals: editFormData.autoProduceSemiFinals
    });
    
    toast.success('Производство успешно обновлено');
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProduction = () => {
    if (!selectedProduction) return;
    
    deleteProduction(selectedProduction.id);
    toast.success('Производство успешно удалено');
    setIsDeleteDialogOpen(false);
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filteredProductions,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedProduction,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    openCreateDialog,
    handleCreateProduction,
    handleEditProduction,
    handleDeleteProduction,
    getRecipeName,
    getRecipeOutput,
    calculateCost,
    getIngredientDetails,
    getIngredientUsageDetails,
    getSemiFinalBreakdown,
    getSelectedRecipe,
    openEditDialog,
    openDeleteDialog,
    openDetailDialog
  };
};
