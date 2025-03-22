
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProductsInStock } from '../../../utils/shippingUtils';

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
  // Get all available products grouped by recipe (consolidated view)
  const consolidatedProducts = useMemo(() => {
    // Get all production batches with available quantity, but group by recipe
    return getProductsInStock(productions, shippings, recipes);
  }, [productions, shippings, recipes]);

  // Find the current recipe ID for the selected production batch
  const currentRecipeId = useMemo(() => {
    const production = productions.find(p => p.id === selectedProductionBatchId);
    return production?.recipeId;
  }, [selectedProductionBatchId, productions]);

  console.log('Consolidated products for selection:', consolidatedProducts);

  return (
    <div className="col-span-3">
      <Select 
        value={currentRecipeId || ''} 
        onValueChange={(recipeId) => {
          // Find the first production batch for this recipe to use as reference
          const productInfo = consolidatedProducts.find(p => p.recipeId === recipeId);
          if (productInfo) {
            onProductChange(productInfo.firstProductionBatchId);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите товар" />
        </SelectTrigger>
        <SelectContent>
          {consolidatedProducts.map((product) => (
            <SelectItem 
              key={product.recipeId} 
              value={product.recipeId}
            >
              {product.recipeName} ({product.availableQuantity} {product.unit})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelector;
