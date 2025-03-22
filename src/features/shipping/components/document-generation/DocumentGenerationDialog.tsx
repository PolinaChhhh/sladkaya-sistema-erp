
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, Printer } from 'lucide-react';
import { ShippingDocument } from '@/store/types/shipping';
import { useDocumentGeneration } from './hooks/useDocumentGeneration';
import { 
  DocumentSelector,
  FormatSelector, 
  DocumentGenerationButton,
  DocumentAlerts,
  UPDGeneratorTest,
  UPDPrintPreview
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
  
  const [activeTab, setActiveTab] = useState<'generation' | 'print-preview'>('generation');
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Создание официального документа</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'generation' | 'print-preview')}>
          <TabsList className="mb-4">
            <TabsTrigger value="generation">
              <FileDown className="h-4 w-4 mr-2" />
              Генерация документа
            </TabsTrigger>
            <TabsTrigger value="print-preview">
              <Printer className="h-4 w-4 mr-2" />
              Печатная форма УПД
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generation" className="space-y-4">
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
            
            <DialogFooter className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="print-preview">
            <UPDPrintPreview shipping={shipping} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGenerationDialog;
