
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText, FileSpreadsheet } from 'lucide-react';
import { ShippingDocument } from '@/store/types/shipping';
import { useStore } from '@/store/recipeStore';
import { prepareDocumentData } from '@/features/shipping/services/document-generator/utils';
import UPDTemplate from './UPDTemplate';
import { 
  generateUPDHtml,
  openPrintWindow,
  generateExcelData,
  downloadDataAsFile
} from '@/features/shipping/services/document-generator/print-templates/printUtils';
import { toast } from 'sonner';

interface UPDPrintPreviewProps {
  shipping: ShippingDocument;
}

/**
 * Компонент для предварительного просмотра и печати УПД
 */
const UPDPrintPreview: React.FC<UPDPrintPreviewProps> = ({ shipping }) => {
  const { buyers, productions, recipes } = useStore();
  const printContainerRef = useRef<HTMLDivElement>(null);
  
  // Находим покупателя
  const buyer = buyers.find(b => b.id === shipping.buyerId);
  
  // Подготовка данных для шаблона
  const documentData = buyer 
    ? prepareDocumentData(shipping, buyer, productions, recipes)
    : null;
  
  const handlePrint = () => {
    if (!buyer) {
      toast.error('Ошибка: Покупатель не найден');
      return;
    }
    
    // Get all the print-related styles
    const allStyles = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('\n');
    
    const htmlContent = generateUPDHtml(
      printContainerRef.current?.innerHTML || '',
      shipping,
      allStyles
    );
    
    const printWindow = openPrintWindow(htmlContent);
    
    if (!printWindow) {
      toast.error('Пожалуйста, разрешите всплывающие окна для печати документа');
    }
  };
  
  // Функция для экспорта в PDF
  const handleExportPDF = () => {
    if (!buyer) {
      toast.error('Ошибка: Покупатель не найден');
      return;
    }
    
    // Get all styles
    const allStyles = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('\n');
    
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          const htmlContent = generateUPDHtml(
            printContainerRef.current?.innerHTML || '',
            shipping,
            allStyles
          );
          
          const printWindow = openPrintWindow(htmlContent);
          
          if (!printWindow) {
            throw new Error('Пожалуйста, разрешите всплывающие окна');
          }
          
          resolve();
        }, 300);
      }),
      {
        loading: 'Генерация PDF...',
        success: 'УПД успешно экспортирован для печати',
        error: 'Ошибка при создании PDF'
      }
    );
  };
  
  // Функция для экспорта в Excel
  const handleExportExcel = () => {
    if (!buyer || !documentData) {
      toast.error('Ошибка: Данные не найдены');
      return;
    }
    
    try {
      // Генерируем CSV данные
      const csvContent = generateExcelData(documentData, shipping, buyer);
      
      // Скачиваем файл
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `УПД_${shipping.shipmentNumber}_${buyer.name.replace(/[^\w\s]/gi, '')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Excel-файл успешно скачан');
    } catch (error) {
      console.error('Ошибка при создании Excel файла:', error);
      toast.error('Ошибка при создании Excel файла');
    }
  };
  
  if (!buyer || !documentData) {
    return (
      <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
        Для предварительного просмотра УПД необходимо выбрать покупателя
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button 
          onClick={handlePrint}
          variant="outline"
          size="sm"
        >
          <Printer className="h-4 w-4 mr-2" />
          Печать
        </Button>
        <Button 
          onClick={handleExportPDF}
          variant="outline"
          size="sm"
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          <FileText className="h-4 w-4 mr-2" />
          Скачать PDF
        </Button>
        <Button 
          onClick={handleExportExcel}
          variant="outline"
          size="sm"
          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Скачать Excel
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Предварительный просмотр УПД</span>
        </div>
        
        <div className="bg-white p-2 overflow-auto max-h-[70vh]" style={{ zoom: '0.6' }}>
          <div ref={printContainerRef} className="print-friendly-content">
            <UPDTemplate data={documentData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPDPrintPreview;
