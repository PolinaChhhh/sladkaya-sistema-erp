
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShippingDocument } from '@/store/types/shipping';
import { useDocumentGeneration } from './hooks/useDocumentGeneration';
import { 
  DocumentSelector,
  FormatSelector, 
  DocumentGenerationButton,
  DocumentAlerts,
  UPDGeneratorTest // Добавляем импорт нашего тестового компонента
} from './components';

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
  const {
    documentType,
    setDocumentType,
    isGenerating,
    documentFormat,
    setDocumentFormat,
    handleDocumentGeneration,
    canGenerate,
    buyer
  } = useDocumentGeneration(shipping, () => onOpenChange(false));
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создание официального документа</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500">
            Выберите тип документа для отгрузки #{shipping.shipmentNumber}
          </p>
          
          <DocumentSelector 
            selectedType={documentType}
            onTypeChange={setDocumentType}
            disabled={isGenerating}
          />
          
          <FormatSelector 
            documentFormat={documentFormat}
            setDocumentFormat={setDocumentFormat}
            isGenerating={isGenerating}
          />
          
          <DocumentAlerts 
            documentType={documentType}
            canGenerate={canGenerate}
            buyer={buyer}
          />
          
          {/* Добавляем тестовую кнопку для генерации УПД */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Тестовая функция:</p>
            <UPDGeneratorTest shipping={shipping} />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Отмена
          </Button>
          
          <DocumentGenerationButton 
            onClick={handleDocumentGeneration}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
            documentFormat={documentFormat}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGenerationDialog;
