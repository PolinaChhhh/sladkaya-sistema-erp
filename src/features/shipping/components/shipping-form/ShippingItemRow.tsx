
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingDocument } from '@/store/recipeStore';
import { vatRateOptions } from '../../hooks/useShippingForm';
import { calculatePriceWithVat } from '../../hooks/useShipmentsList';
import { getProductsInStock } from '../../utils/shippingUtils';

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
  
  // Get products that are actually in stock, now grouped by recipe
  const productsInStock = getProductsInStock(productions, shippings, recipes);

  return (
    <div className="grid grid-cols-12 gap-2 p-3 text-sm border-t border-gray-100 items-center">
      <div className="col-span-3">
        <Select 
          value={item.productionBatchId} 
          onValueChange={(value) => updateShippingItem(idx, 'productionBatchId', value)}
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
                {product.recipeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-1 text-center">
        <span className="font-medium whitespace-nowrap">{availableQuantity} {productUnit}</span>
      </div>
      
      <div className="col-span-1">
        <Input
          type="number"
          min="1"
          max={availableQuantity}
          value={item.quantity}
          onChange={(e) => updateShippingItem(idx, 'quantity', Number(e.target.value))}
          className="text-center"
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
