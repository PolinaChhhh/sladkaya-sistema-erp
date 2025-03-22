
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProductsInStock, getAvailableProductionBatches } from '../../../utils/shippingUtils';

interface ProductSelectorProps {
  selectedProductionBatchId: string;
  onProductChange: (newBatchId: string) => void;
  productions: any[];
  recipes: any[];
  shippings: any[];
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProductionBatchId,
  onProductChange,
  productions,
  recipes,
  shippings
}) => {
  // Get all available production batches (not grouped by recipe)
  const availableBatches = useMemo(() => {
    // Get all production batches with available quantity
    return productions
      .filter(production => {
        // Calculate already shipped quantity
        const shippedQuantity = shippings.reduce((total, shipping) => {
          return total + shipping.items
            .filter(item => item.productionBatchId === production.id)
            .reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        
        // Stock quantity is production quantity minus shipped quantity
        const availableQuantity = Math.max(0, production.quantity - shippedQuantity);
        return availableQuantity > 0;
      })
      .map(production => {
        const recipe = recipes.find(r => r.id === production.recipeId);
        
        // Calculate already shipped quantity
        const shippedQuantity = shippings.reduce((total, shipping) => {
          return total + shipping.items
            .filter(item => item.productionBatchId === production.id)
            .reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        
        const availableQuantity = Math.max(0, production.quantity - shippedQuantity);
        
        return {
          productionBatchId: production.id,
          recipeId: production.recipeId,
          recipeName: recipe ? recipe.name : 'Неизвестный рецепт',
          availableQuantity,
          unit: recipe ? recipe.outputUnit : 'шт',
        };
      })
      .sort((a, b) => a.recipeName.localeCompare(b.recipeName));
  }, [productions, shippings, recipes]);

  console.log('Available batches for selection:', availableBatches);

  return (
    <div className="col-span-3">
      <Select 
        value={selectedProductionBatchId} 
        onValueChange={onProductChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите товар" />
        </SelectTrigger>
        <SelectContent>
          {availableBatches.map((batch) => (
            <SelectItem 
              key={batch.productionBatchId} 
              value={batch.productionBatchId}
            >
              {batch.recipeName} ({batch.availableQuantity} {batch.unit})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelector;
