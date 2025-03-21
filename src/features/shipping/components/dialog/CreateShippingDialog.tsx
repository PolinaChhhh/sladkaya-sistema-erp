
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useShippingForm } from '../../hooks/useShippingForm';
import { ShippingDocument } from '@/store/recipeStore';
import DialogBody from './DialogBody';

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
  isEditing?: boolean;
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
  onSubmit,
  isEditing = false
}) => {
  const { 
    addShippingItem, 
    updateShippingItem, 
    removeShippingItem 
  } = useShippingForm(formData, setFormData, productions, shippings, recipes);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать отгрузку' : 'Создать отгрузку'}</DialogTitle>
        </DialogHeader>
        
        <DialogBody 
          formData={formData}
          setFormData={setFormData}
          buyers={buyers}
          productions={productions}
          recipes={recipes}
          shippings={shippings}
          addShippingItem={addShippingItem}
          updateShippingItem={updateShippingItem}
          removeShippingItem={removeShippingItem}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingDialog;
