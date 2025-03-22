
import React from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import ShippingItemRow from './ShippingItemRow';
import ShippingTableHeader from './ShippingTableHeader';
import ShippingTableFooter from './ShippingTableFooter';
import { getProductName, getProductUnit, getProductsInStock, getAvailableQuantity } from '../../utils/shippingUtils';

interface ShippingItemsTableProps {
  items: {
    productionBatchId: string;
    quantity: number;
    price: number;
    vatRate: number;
  }[];
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
  updateShippingItem: (index: number, field: string, value: any) => void;
  removeShippingItem: (index: number) => void;
}

const ShippingItemsTable: React.FC<ShippingItemsTableProps> = ({
  items,
  productions,
  recipes,
  shippings,
  updateShippingItem,
  removeShippingItem
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-500">Добавьте товары для отгрузки</p>
      </div>
    );
  }

  // Get all products in stock (grouped by recipe)
  const productsInStock = getProductsInStock(productions, shippings, recipes);
  
  console.log('Shipping items table:', { items, groupedProducts: productsInStock });

  return (
    <div className="bg-white/70 rounded-lg border overflow-hidden">
      <ShippingTableHeader />
      
      {items.map((item, idx) => {
        // Find production and recipe
        const production = productions.find(p => p.id === item.productionBatchId);
        
        // Get the recipeId from the production
        const recipeId = production?.recipeId;
        
        // Get product details from the grouped products if available
        const productDetails = recipeId
          ? productsInStock.find(p => p.recipeId === recipeId)
          : null;
        
        // Use total recipe quantity instead of just the batch quantity
        const totalAvailableQuantity = productDetails?.availableQuantity || 0;
        
        // Also get precise batch quantity for validation
        const preciseAvailableQuantity = getAvailableQuantity(productions, shippings, item.productionBatchId);
        
        // Use the utility functions or fallback to values from grouped products
        const productName = getProductName(productions, recipes, item.productionBatchId);
        const productUnit = getProductUnit(productions, recipes, item.productionBatchId);
        
        console.log('Processing item:', { 
          item, 
          productionId: item.productionBatchId,
          productName,
          batchAvailableQuantity: preciseAvailableQuantity,
          totalAvailableQuantity
        });
        
        return (
          <ShippingItemRow
            key={idx}
            item={item}
            idx={idx}
            availableQuantity={totalAvailableQuantity} // Use total quantity for display
            preciseAvailableQuantity={preciseAvailableQuantity} // Pass batch quantity for validation
            productName={productName}
            productUnit={productUnit}
            updateShippingItem={updateShippingItem}
            removeShippingItem={removeShippingItem}
            productions={productions}
            recipes={recipes}
            shippings={shippings}
          />
        );
      })}
      
      <ShippingTableFooter items={items} />
    </div>
  );
};

export default ShippingItemsTable;
