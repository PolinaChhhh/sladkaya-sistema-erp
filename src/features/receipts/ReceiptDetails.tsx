
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/store/recipeStore';
import { useReceiptDetails } from './hooks/useReceiptDetails';
import ReceiptDetailsHeader from './components/ReceiptDetailsHeader';
import ReceiptDetailsItems from './components/ReceiptDetailsItems';

interface ReceiptDetailsProps {
  receipt: Receipt;
  onClose: () => void;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ receipt, onClose }) => {
  const { getSupplierName, getIngredientName, getIngredientUnit, formatDate } = useReceiptDetails(receipt);
  
  const supplierName = getSupplierName(receipt.supplierId);
  const formattedDate = formatDate(receipt.date);

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Детали поступления</DialogTitle>
      </DialogHeader>
      
      <ReceiptDetailsHeader 
        supplierName={supplierName}
        formattedDate={formattedDate}
        referenceNumber={receipt.referenceNumber}
        totalAmount={receipt.totalAmount}
        notes={receipt.notes}
      />
      
      <ReceiptDetailsItems 
        items={receipt.items}
        getIngredientName={getIngredientName}
        getIngredientUnit={getIngredientUnit}
      />
      
      <DialogFooter>
        <Button onClick={onClose}>
          Закрыть
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ReceiptDetails;
