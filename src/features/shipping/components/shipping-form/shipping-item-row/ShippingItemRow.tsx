import React, { useMemo } from 'react';
import { ShippingItemRowProps } from './types';
import { getProductsInStock, getAvailableProductionBatches } from '../../../utils/shippingUtils';
import ProductSelector from './ProductSelector';
import AvailableQuantityDisplay from './AvailableQuantityDisplay';
import QuantityInput from './QuantityInput';
import PriceInput from './PriceInput';
import VatRateSelector from './VatRateSelector';
import PriceWithVatDisplay from './PriceWithVatDisplay';
import AmountDisplay from './AmountDisplay';
import RemoveButton from './RemoveButton';

const ShippingItemRow: React.FC<ShippingItemRowProps> = ({
  item,
  idx,
  availableQuantity,
  preciseAvailableQuantity,
  productName,
  productUnit,
  updateShippingItem,
  removeShippingItem,
  productions,
  recipes,
  shippings
}) => {
  // Get selected production batch
  const selectedProduction = useMemo(() => {
    return productions.find(p => p.id === item.productionBatchId);
  }, [productions, item.productionBatchId]);
  
  // Get selected product recipe ID
  const selectedRecipeId = selectedProduction?.recipeId;
  
  // Get all available production batches for the selected recipe
  const availableBatches = useMemo(() => {
    if (!selectedRecipeId) return [];
    return getAvailableProductionBatches(productions, shippings, selectedRecipeId);
  }, [selectedRecipeId, productions, shippings]);
  
  // Get products that are actually in stock, grouped by recipe
  const productsInStock = useMemo(() => {
    return getProductsInStock(productions, shippings, recipes);
  }, [productions, shippings, recipes]);
  
  // Handle production batch change
  const handleBatchChange = (newBatchId: string) => {
    if (newBatchId === item.productionBatchId) return;
    
    // Update the production batch ID
    updateShippingItem(idx, 'productionBatchId', newBatchId);
    
    // Get the new production details
    const newProduction = productions.find(p => p.id === newBatchId);
    if (newProduction) {
      // Find the recipe for this production
      const recipeId = newProduction.recipeId;
      // Get all available quantity for this recipe
      const productDetails = productsInStock.find(p => p.recipeId === recipeId);
      const totalAvailable = productDetails?.availableQuantity || 0;
      
      // Set quantity to 1 by default (or keep current if valid)
      const newQuantity = Math.min(item.quantity > 0 ? item.quantity : 1, totalAvailable);
      updateShippingItem(idx, 'quantity', newQuantity);
      
      // Calculate the unit cost from the production's total cost and quantity
      const unitCost = newProduction.quantity > 0 
        ? newProduction.cost / newProduction.quantity 
        : 0;
      
      updateShippingItem(idx, 'price', unitCost * 1.3); // Default 30% markup
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    updateShippingItem(idx, 'quantity', newQuantity);
  };

  // Handle remove button click
  const handleRemove = () => {
    removeShippingItem(idx);
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-3 text-sm border-t border-gray-100 items-center">
      <ProductSelector 
        selectedProductionBatchId={item.productionBatchId}
        onProductChange={handleBatchChange}
        productions={productions}
        recipes={recipes}
        shippings={shippings}
      />
      
      <AvailableQuantityDisplay 
        availableQuantity={availableQuantity}
        productUnit={productUnit}
      />
      
      <QuantityInput 
        quantity={item.quantity}
        availableQuantity={availableQuantity}
        productName={productName}
        productUnit={productUnit}
        onChange={handleQuantityChange}
      />
      
      <PriceInput 
        price={item.price}
        index={idx}
        onChange={updateShippingItem}
      />
      
      <VatRateSelector 
        vatRate={item.vatRate}
        index={idx}
        onChange={updateShippingItem}
      />
      
      <PriceWithVatDisplay 
        price={item.price}
        vatRate={item.vatRate}
      />
      
      <AmountDisplay 
        quantity={item.quantity}
        price={item.price}
        vatRate={item.vatRate}
      />
      
      <RemoveButton onRemove={handleRemove} />
    </div>
  );
};

export default ShippingItemRow;
