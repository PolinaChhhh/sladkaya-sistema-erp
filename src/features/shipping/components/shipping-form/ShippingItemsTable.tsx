
import React from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import ShippingItemRow from './ShippingItemRow';
import ShippingTableHeader from './ShippingTableHeader';
import ShippingTableFooter from './ShippingTableFooter';

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

  return (
    <div className="bg-white/70 rounded-lg border overflow-hidden">
      <ShippingTableHeader />
      
      {items.map((item, idx) => {
        const production = productions.find(p => p.id === item.productionBatchId);
        const recipe = production ? recipes.find(r => r.id === production.recipeId) : null;
        
        // Calculate available quantity
        const alreadyShippedQuantity = shippings.reduce((total, shipping) => {
          return total + shipping.items
            .filter(shippingItem => shippingItem.productionBatchId === item.productionBatchId)
            .reduce((sum, shippingItem) => sum + shippingItem.quantity, 0);
        }, 0);
        
        const availableQuantity = production ? production.quantity - alreadyShippedQuantity : 0;
        const productName = recipe?.name || 'Неизвестно';
        const productUnit = recipe?.outputUnit || 'шт';
        
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
