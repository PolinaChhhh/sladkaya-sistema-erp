
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
      productName?: string; // Make optional to match our type change
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
      productName?: string; // Make optional to match our type change
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
    <div className="my-4 space-y-6">
      <ShippingFormHeader
        onAddItem={() => {
          const result = addShippingItem();
          if (result.error) {
            // Could use toast here
            alert(result.error);
          }
        }}
      />
      
      <ShippingFormBasicFields
        buyers={buyers}
        formData={formData}
        setFormData={setFormData}
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
  );
};

export default DialogBody;
