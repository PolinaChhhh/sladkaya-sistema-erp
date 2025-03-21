
import React, { useMemo } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductionBatch, Recipe, Ingredient, Receipt } from '@/store/types';
import { format } from 'date-fns';
import ProductionSummary from './production-detail/ProductionSummary';
import IngredientsUsageSection from './production-detail/IngredientsUsageSection';
import SemiFinalsSection from './production-detail/SemiFinalsSection';
import { calculateProductionCostWithFifo } from '../utils/fifoCalculator';

interface ProductionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  production: ProductionBatch | null;
  recipe: Recipe | null;
  receipts: Receipt[];
  ingredients: Ingredient[];
  getRecipeName: (recipeId: string) => string;
}

const ProductionDetailDialog: React.FC<ProductionDetailDialogProps> = ({
  isOpen,
  onClose,
  production,
  recipe,
  receipts,
  ingredients,
  getRecipeName
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return dateString;
    }
  };

  // Calculate ingredient usage with FIFO
  const ingredientUsage = useMemo(() => {
    if (!production || !recipe) return [];
    
    // Use our FIFO calculator to get the breakdown
    const costBreakdown = calculateProductionCostWithFifo(
      recipe,
      production.quantity,
      ingredients,
      receipts
    );
    
    return costBreakdown.breakdown.map(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      return {
        ingredientId: item.ingredientId,
        name: ingredient?.name || 'Unknown',
        amount: item.amount,
        unit: ingredient?.unit || '',
        cost: item.cost,
        fifoDetails: item.details.map(detail => ({
          receiptDate: formatDate(detail.receiptDate),
          amount: detail.amountUsed,
          unitPrice: detail.unitPrice,
          totalCost: detail.totalPrice,
          reference: detail.receiptReference || ''
        }))
      };
    });
  }, [production, recipe, ingredients, receipts]);
  
  // Calculate semi-finals breakdown
  const semiFinalsBreakdown = useMemo(() => {
    if (!production || !recipe) return [];
    
    // Get all semi-finals recipes used in this recipe
    return recipe.items
      .filter(item => item.type === 'recipe' && item.recipeId)
      .map(item => {
        const productionRatio = production.quantity / recipe.output;
        const amount = item.amount * productionRatio;
        
        return {
          recipeId: item.recipeId as string,
          amount,
          cost: 0 // We're not calculating cost for semi-finals as requested
        };
      });
  }, [production, recipe]);

  if (!production || !recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Детали производства</DialogTitle>
          <DialogDescription>
            Информация о списании ингредиентов и затратах
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ProductionSummary production={production} recipe={recipe} />
          
          <IngredientsUsageSection ingredientUsageDetails={ingredientUsage} />
          
          <SemiFinalsSection 
            semiFinalsBreakdown={semiFinalsBreakdown} 
            getRecipeName={getRecipeName}
            recipeCategory={recipe.category}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionDetailDialog;
