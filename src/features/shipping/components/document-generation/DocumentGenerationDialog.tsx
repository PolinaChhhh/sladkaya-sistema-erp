
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, FileText, FileSpreadsheet, Upload } from 'lucide-react';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument, RussianDocumentType } from '@/store/types/shipping';
import DocumentSelector from './DocumentSelector';
import { 
  prepareDocumentData, 
  generateDocument, 
  downloadDocument, 
  buildDocumentFileName,
  setDocumentTemplate
} from '../../services/documentGenerator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { buyers, productions, recipes, updateShippingDocument } = useStore();
  const [documentType, setDocumentType] = useState<RussianDocumentType>('TORG12');
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentFormat, setDocumentFormat] = useState<'word' | 'excel'>('excel');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Find the buyer for this shipping
  const buyer = buyers.find(b => b.id === shipping.buyerId);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTemplateFile(file);
      toast.success(`Шаблон "${file.name}" загружен`);
    }
  };
  
  const handleDocumentGeneration = async () => {
    if (!buyer) {
      toast.error('Для создания документа необходимы данные клиента');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // If template file is provided, set it first
      if (templateFile) {
        await setDocumentTemplate(documentType, templateFile);
      }
      
      // Prepare data for document generation
      const documentData = prepareDocumentData(shipping, buyer, productions, recipes);
      
      // Generate the document in the selected format
      const documentBlob = await generateDocument(documentType, documentData, documentFormat);
      
      // Build the filename
      const fileName = buildDocumentFileName(documentType, shipping.shipmentNumber, buyer.name, documentFormat);
      
      // Download the document
      downloadDocument(documentBlob, fileName);
      
      // Update the shipping record to mark document as generated
      updateShippingDocument(shipping.id, documentType, true);
      
      toast.success(`Документ успешно создан в формате ${documentFormat === 'word' ? 'Word' : 'Excel'}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Ошибка при создании документа');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const canGenerate = Boolean(buyer) && shipping.items.length > 0;
  
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Загрузить шаблон (опционально)</label>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {templateFile ? 'Изменить шаблон' : 'Загрузить шаблон'}
              </Button>
              {templateFile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setTemplateFile(null)}
                  disabled={isGenerating}
                >
                  Удалить
                </Button>
              )}
              <input 
                type="file" 
                accept=".docx,.xls,.xlsx" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
            </div>
            
            {templateFile && (
              <p className="text-xs text-green-600 mt-1">
                Загружен шаблон: {templateFile.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Формат документа</label>
            <Tabs 
              value={documentFormat} 
              onValueChange={(value) => setDocumentFormat(value as 'word' | 'excel')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="word" disabled={isGenerating}>
                  <FileText className="h-4 w-4 mr-2" />
                  Word
                </TabsTrigger>
                <TabsTrigger value="excel" disabled={isGenerating}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {documentType === 'TORG12' && !templateFile && (
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-xs text-amber-800">
                Для формы ТОРГ-12 рекомендуется загрузить шаблон документа для корректного формирования.
              </AlertDescription>
            </Alert>
          )}
          
          {!canGenerate && (
            <div className="text-sm p-3 bg-amber-50 text-amber-800 rounded-md">
              Для создания документа необходимы данные клиента и товары
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Отмена
          </Button>
          
          <Button
            onClick={handleDocumentGeneration}
            disabled={!canGenerate || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                {documentFormat === 'word' ? (
                  <FileText className="h-4 w-4 mr-2" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                Создать и скачать
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGenerationDialog;
