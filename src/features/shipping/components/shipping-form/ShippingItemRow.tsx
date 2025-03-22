
import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingDocument } from '@/store/recipeStore';
import { vatRateOptions } from '../../hooks/useShippingForm';
import { calculatePriceWithVat } from '../../hooks/useShipmentsList';
import { getProductsInStock, getAvailableProductionBatches, getAvailableQuantity } from '../../utils/shippingUtils';
import { toast } from 'sonner';

interface ShippingItemRowProps {
  item: {
    productionBatchId: string;
    quantity: number;
    price: number;
    vatRate: number;
  };
  idx: number;
  availableQuantity: number;
  productName: string;
  productUnit: string;
  updateShippingItem: (index: number, field: string, value: any) => void;
  removeShippingItem: (index: number) => void;
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
}

const ShippingItemRow: React.FC<ShippingItemRowProps> = ({
  item,
  idx,
  availableQuantity,
  productName,
  productUnit,
  updateShippingItem,
  removeShippingItem,
  productions,
  recipes,
  shippings
}) => {
  const priceWithVat = calculatePriceWithVat(item.price, item.vatRate);
  const amount = item.quantity * priceWithVat;
  
  // Get products that are actually in stock, grouped by recipe
  const productsInStock = useMemo(() => {
    return getProductsInStock(productions, shippings, recipes);
  }, [productions, shippings, recipes]);
  
  // Get selected production batch
  const selectedProduction = useMemo(() => {
    return productions.find(p => p.id === item.productionBatchId);
  }, [productions, item.productionBatchId]);
  
  // Get selected product recipe ID
  const selectedRecipeId = selectedProduction?.recipeId;
  
  // Get precise available quantity for the selected production batch
  const preciseAvailableQuantity = useMemo(() => {
    return getAvailableQuantity(productions, shippings, item.productionBatchId);
  }, [productions, shippings, item.productionBatchId]);
  
  // Get all available production batches for the selected recipe
  const availableBatches = useMemo(() => {
    if (!selectedRecipeId) return [];
    return getAvailableProductionBatches(productions, shippings, selectedRecipeId);
  }, [selectedRecipeId, productions, shippings]);
  
  // Handle quantity validation to respect available stock
  const handleQuantityChange = (newQuantity: number) => {
    // Ensure we get a valid number
    const parsedQuantity = newQuantity < 0 ? 0 : newQuantity;
    
    // Make sure we don't exceed available stock
    const validQuantity = Math.min(parsedQuantity, preciseAvailableQuantity);
    
    if (validQuantity !== parsedQuantity && parsedQuantity > 0) {
      console.log(`Limiting quantity to available stock: ${validQuantity} (requested: ${parsedQuantity})`);
      toast.warning(`Доступно только ${validQuantity} ${productUnit} товара "${productName}"`);
    }
    
    updateShippingItem(idx, 'quantity', validQuantity);
  };
  
  // Handle production batch change
  const handleBatchChange = (newBatchId: string) => {
    if (newBatchId === item.productionBatchId) return;
    
    // Get available quantity for the new batch
    const newBatchAvailability = getAvailableQuantity(productions, shippings, newBatchId);
    
    // Update the production batch ID
    updateShippingItem(idx, 'productionBatchId', newBatchId);
    
    // Reset quantity to 1 or to the max available if less than 1
    const newQuantity = Math.min(1, newBatchAvailability);
    updateShippingItem(idx, 'quantity', newQuantity);
    
    // Update price based on the production's unit cost
    const newProduction = productions.find(p => p.id === newBatchId);
    if (newProduction) {
      // Calculate the unit cost from the production's total cost and quantity
      const unitCost = newProduction.quantity > 0 
        ? newProduction.cost / newProduction.quantity 
        : 0;
      
      updateShippingItem(idx, 'price', unitCost * 1.3); // Default 30% markup
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-3 text-sm border-t border-gray-100 items-center">
      <div className="col-span-3">
        <Select 
          value={item.productionBatchId} 
          onValueChange={handleBatchChange}
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
      
      <div className="col-span-1 text-center">
        <span className={`font-medium whitespace-nowrap ${preciseAvailableQuantity === 0 ? "text-red-500" : ""}`}>
          {preciseAvailableQuantity} {productUnit}
        </span>
      </div>
      
      <div className="col-span-1">
        <Input
          type="number"
          min="1"
          max={preciseAvailableQuantity}
          value={item.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="text-center"
          disabled={preciseAvailableQuantity === 0}
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.price}
          onChange={(e) => updateShippingItem(idx, 'price', Number(e.target.value))}
          className="text-center"
        />
      </div>
      
      <div className="col-span-1">
        <Select
          value={String(item.vatRate)}
          onValueChange={(value) => updateShippingItem(idx, 'vatRate', Number(value))}
        >
          <SelectTrigger className="text-center">
            <SelectValue placeholder="НДС %" />
          </SelectTrigger>
          <SelectContent>
            {vatRateOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-2">
        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center font-medium">
          {priceWithVat.toFixed(2)} ₽
        </div>
      </div>
      
      <div className="col-span-1">
        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 text-center font-medium">
          {amount.toFixed(2)} ₽
        </div>
      </div>
      
      <div className="col-span-1 text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500" 
          onClick={() => removeShippingItem(idx)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShippingItemRow;
