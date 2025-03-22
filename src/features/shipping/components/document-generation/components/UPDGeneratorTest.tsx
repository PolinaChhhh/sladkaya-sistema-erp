
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument } from '@/store/types/shipping';
import { prepareDocumentData, downloadDocument } from '@/features/shipping/services/document-generator/utils';
import { generateUPDDocument } from '@/features/shipping/services/document-generator/updGenerator';
import { toast } from 'sonner';

interface UPDGeneratorTestProps {
  shipping: ShippingDocument;
}

/**
 * Компонент для тестирования генерации УПД
 * (Это временный компонент для демонстрации, его можно будет удалить после тестирования)
 */
const UPDGeneratorTest: React.FC<UPDGeneratorTestProps> = ({ shipping }) => {
  const { buyers, productions, recipes } = useStore();
  
  const handleGenerateUPD = () => {
    // Находим покупателя
    const buyer = buyers.find(b => b.id === shipping.buyerId);
    
    if (!buyer) {
      toast.error('Ошибка: Покупатель не найден');
      return;
    }
    
    try {
      // Подготовка данных
      const documentData = prepareDocumentData(shipping, buyer, productions, recipes);
      
      // Генерация УПД
      const updBlob = generateUPDDocument(documentData);
      
      // Формирование имени файла
      const fileName = `УПД_${shipping.shipmentNumber}_${buyer.name.replace(/[^\w\s]/gi, '')}.xml`;
      
      // Скачивание файла
      downloadDocument(updBlob, fileName);
      
      toast.success('УПД успешно сгенерирован');
    } catch (error) {
      console.error('Ошибка при генерации УПД:', error);
      toast.error('Ошибка при генерации УПД');
    }
  };
  
  return (
    <Button 
      onClick={handleGenerateUPD} 
      variant="outline" 
      className="bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-200"
    >
      <FileDown className="h-4 w-4 mr-2" />
      Тест УПД (XML)
    </Button>
  );
};

export default UPDGeneratorTest;
