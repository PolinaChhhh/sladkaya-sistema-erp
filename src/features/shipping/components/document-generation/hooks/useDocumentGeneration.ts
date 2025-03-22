import { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument, RussianDocumentType } from '@/store/types/shipping';
import { 
  prepareDocumentData, 
  generateDocument, 
  downloadDocument, 
  buildDocumentFileName,
  setDocumentTemplate
} from '../../../services/document-generator';

export const useDocumentGeneration = (
  shipping: ShippingDocument,
  onDialogClose: () => void
) => {
  const { buyers, productions, recipes, updateShippingDocument } = useStore();
  const [documentType, setDocumentType] = useState<RussianDocumentType>('TORG12');
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentFormat, setDocumentFormat] = useState<'word' | 'excel'>('excel');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  
  // Find the buyer for this shipping
  const buyer = buyers.find(b => b.id === shipping.buyerId);
  
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
      onDialogClose();
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Ошибка при создании документа');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const canGenerate = Boolean(buyer) && shipping.items.length > 0;
  
  return {
    documentType,
    setDocumentType,
    isGenerating,
    documentFormat,
    setDocumentFormat,
    templateFile,
    setTemplateFile,
    handleDocumentGeneration,
    canGenerate,
    buyer
  };
};
