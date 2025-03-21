
import React, { useMemo } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductionBatch, Recipe } from '@/store/types';
import ProductionSummary from './production-detail/ProductionSummary';
import IngredientsUsageSection from './production-detail/IngredientsUsageSection';
import SemiFinalsSection from './production-detail/SemiFinalsSection';

interface ProductionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  production: ProductionBatch | null;
  recipe: Recipe | null;
  getIngredientDetails: (ingredientId: string) => any;
  getRecipeName: (recipeId: string) => string;
  getIngredientUsageDetails: (production: ProductionBatch) => any;
  getSemiFinalBreakdown: (production: ProductionBatch) => { recipeId: string, amount: number, cost: number }[];
}

const ProductionDetailDialog: React.FC<ProductionDetailDialogProps> = ({
  isOpen,
  onClose,
  production,
  recipe,
  getIngredientDetails,
  getRecipeName,
  getIngredientUsageDetails,
  getSemiFinalBreakdown
}) => {
  if (!production || !recipe) return null;

  // Get ingredient usage details
  const ingredientUsage = getIngredientUsageDetails(production);
  
  // Get semi-finals breakdown
  const semiFinalsBreakdown = getSemiFinalBreakdown(production);

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
