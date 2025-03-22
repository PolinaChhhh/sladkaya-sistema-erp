
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProductsInStock } from '../../../utils/shippingUtils';
import { ShippingItemRowProps } from './types';

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
  // Get products that are actually in stock, grouped by recipe
  const productsInStock = useMemo(() => {
    return getProductsInStock(productions, shippings, recipes);
  }, [productions, shippings, recipes]);

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
          {productsInStock.map((product) => (
            <SelectItem 
              key={product.firstProductionBatchId} 
              value={product.firstProductionBatchId}
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
