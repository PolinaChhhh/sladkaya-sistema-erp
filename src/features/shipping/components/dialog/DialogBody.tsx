
import React from 'react';
import { ShippingDocument } from '@/store/recipeStore';
import { ShippingFormHeader, ShippingFormBasicFields, ShippingItemsTable } from '../shipping-form';

interface DialogBodyProps {
  formData: {
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
      productName?: string;
    }[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
      productName?: string;
    }[];
  }>>;
  buyers: any[];
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
  addShippingItem: () => { error?: string; success?: boolean };
  updateShippingItem: (index: number, field: string, value: any) => void;
  removeShippingItem: (index: number) => void;
}

const DialogBody: React.FC<DialogBodyProps> = ({
  formData,
  setFormData,
  buyers,
  productions,
  recipes,
  shippings,
  addShippingItem,
  updateShippingItem,
  removeShippingItem
}) => {
  return (
    <div className="grid gap-6 py-4">
      <ShippingFormBasicFields
        buyers={buyers}
        formData={formData}
        setFormData={setFormData}
      />
      
      <div className="space-y-2">
        <ShippingFormHeader
          onAddItem={() => {
            const result = addShippingItem();
            if (result.error) {
              // Could use toast here
              alert(result.error);
            }
          }}
        />
        
        <ShippingItemsTable
          items={formData.items}
          productions={productions}
          recipes={recipes}
          shippings={shippings}
          updateShippingItem={updateShippingItem}
          removeShippingItem={removeShippingItem}
        />
      </div>
    </div>
  );
};

export default DialogBody;
