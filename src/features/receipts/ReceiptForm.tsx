
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/store/recipeStore';
import { useReceiptForm } from './hooks/useReceiptForm';
import ReceiptGeneralInfo from './components/ReceiptGeneralInfo';
import ReceiptItemsList from './components/ReceiptItemsList';

interface ReceiptFormProps {
  isCreateMode: boolean;
  receipt: Receipt | null;
  onCancel: () => void;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({
  isCreateMode,
  receipt,
  onCancel
}) => {
  const {
    formData,
    setFormData,
    suppliers,
    ingredients,
    calculateTotalAmount,
    addReceiptItem,
    updateReceiptItem,
    removeReceiptItem,
    getIngredientName,
    getIngredientUnit,
    handleSubmit
  } = useReceiptForm({ isCreateMode, receipt, onCancel });

  return (
    <DialogContent className="sm:max-w-3xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? 'Добавить поступление' : 'Редактировать поступление'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ReceiptGeneralInfo 
            supplierId={formData.supplierId}
            setSupplierId={(value) => setFormData({ ...formData, supplierId: value })}
            date={formData.date}
            setDate={(value) => setFormData({ ...formData, date: value })}
            referenceNumber={formData.referenceNumber}
            setReferenceNumber={(value) => setFormData({ ...formData, referenceNumber: value })}
            notes={formData.notes}
            setNotes={(value) => setFormData({ ...formData, notes: value })}
            totalAmount={calculateTotalAmount()}
            suppliers={suppliers}
          />
          
          <ReceiptItemsList 
            items={formData.items}
            ingredients={ingredients}
            addReceiptItem={addReceiptItem}
            updateReceiptItem={updateReceiptItem}
            removeReceiptItem={removeReceiptItem}
            getIngredientName={getIngredientName}
            getIngredientUnit={getIngredientUnit}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-cream-600 hover:bg-cream-700">
            {isCreateMode ? 'Добавить' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ReceiptForm;
