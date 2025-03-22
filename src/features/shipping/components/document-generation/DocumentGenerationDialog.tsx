
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShippingDocument } from '@/store/types/shipping';
import { UPDPrintPreview } from './components';

interface DocumentGenerationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shipping: ShippingDocument;
}

const DocumentGenerationDialog: React.FC<DocumentGenerationDialogProps> = ({
  isOpen,
  onOpenChange,
  shipping
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Печатная форма УПД</DialogTitle>
        </DialogHeader>
        
        <UPDPrintPreview shipping={shipping} />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGenerationDialog;
