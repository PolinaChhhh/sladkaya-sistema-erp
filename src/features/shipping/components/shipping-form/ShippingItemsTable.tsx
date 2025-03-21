
import React from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import ShippingItemRow from './ShippingItemRow';
import ShippingTableHeader from './ShippingTableHeader';
import ShippingTableFooter from './ShippingTableFooter';
import { getAvailableQuantity, getProductName, getProductUnit } from '../../utils/shippingUtils';

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

  console.log('Shipping items table:', { items, productions, shippings });

  return (
    <div className="bg-white/70 rounded-lg border overflow-hidden">
      <ShippingTableHeader />
      
      {items.map((item, idx) => {
        // Use the utility functions to get product details
        const productName = getProductName(productions, recipes, item.productionBatchId);
        const productUnit = getProductUnit(productions, recipes, item.productionBatchId);
        const availableQuantity = getAvailableQuantity(productions, shippings, item.productionBatchId);
        
        console.log('Processing item:', { 
          item, 
          productionId: item.productionBatchId,
          productName,
          availableQuantity
        });
        
        return (
          <ShippingItemRow
            key={idx}
            item={item}
            idx={idx}
            availableQuantity={availableQuantity}
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
