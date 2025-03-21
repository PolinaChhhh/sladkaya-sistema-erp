
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { ShippingDocument } from '@/store/recipeStore';
import { toast } from 'sonner';
import { useShippingForm } from '../hooks/useShippingForm';
import {
  ShippingFormHeader,
  ShippingFormBasicFields,
  ShippingItemsHeader,
  ShippingItemsTable
} from './shipping-form';

interface CreateShippingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    buyerId: string;
    date: string;
    items: {
      productionBatchId: string;
      quantity: number;
      price: number;
      vatRate: number;
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
    }[];
  }>>;
  buyers: any[];
  productions: any[];
  recipes: any[];
  shippings: ShippingDocument[];
  onSubmit: () => void;
}

const CreateShippingDialog: React.FC<CreateShippingDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  buyers,
  productions,
  recipes,
  shippings,
  onSubmit
}) => {
  const { addShippingItem, updateShippingItem, removeShippingItem } = useShippingForm(
    formData,
    setFormData,
    productions,
    shippings
  );

  const handleAddItem = () => {
    const result = addShippingItem();
    if (result.error) {
      toast.error(result.error);
    }
  };

  const handleBuyerChange = (value: string) => {
    setFormData({...formData, buyerId: value});
  };

  const handleDateChange = (value: string) => {
    setFormData({...formData, date: value});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <ShippingFormHeader />
        
        <div className="grid gap-6 py-4">
          <ShippingFormBasicFields 
            buyerId={formData.buyerId}
            date={formData.date}
            buyers={buyers}
            onBuyerChange={handleBuyerChange}
            onDateChange={handleDateChange}
          />
          
          <div className="space-y-4">
            <ShippingItemsHeader onAddItem={handleAddItem} />
            
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit}>Создать отгрузку</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingDialog;
