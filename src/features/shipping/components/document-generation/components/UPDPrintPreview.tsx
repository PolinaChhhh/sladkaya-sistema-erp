
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, FilePlus } from 'lucide-react';
import { ShippingDocument } from '@/store/types/shipping';
import { useStore } from '@/store/recipeStore';
import { prepareDocumentData } from '@/features/shipping/services/document-generator/utils';
import { UPDPrintTemplate } from '@/features/shipping/services/document-generator/print-templates';
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
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Пожалуйста, разрешите всплывающие окна для печати документа');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>УПД №${shipping.shipmentNumber}</title>
          <style>
            ${document.querySelector('style')?.innerHTML || ''}
          </style>
        </head>
        <body>
          ${printContainerRef.current?.innerHTML || ''}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  // Функция скачивания HTML в виде файла
  const handleDownloadHTML = () => {
    if (!buyer) {
      toast.error('Ошибка: Покупатель не найден');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>УПД №${shipping.shipmentNumber}</title>
          <style>
            ${document.querySelector('style')?.innerHTML || ''}
          </style>
        </head>
        <body>
          ${printContainerRef.current?.innerHTML || ''}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `УПД_${shipping.shipmentNumber}_${buyer.name.replace(/[^\w\s]/gi, '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('HTML-шаблон успешно скачан');
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
      <div className="flex space-x-2 justify-end">
        <Button 
          onClick={handlePrint}
          variant="outline"
          size="sm"
        >
          <Printer className="h-4 w-4 mr-2" />
          Печать
        </Button>
        <Button 
          onClick={handleDownloadHTML}
          variant="outline"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Скачать HTML
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Предварительный просмотр УПД</span>
          <FilePlus className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="bg-white p-2 overflow-auto max-h-[70vh]" style={{ zoom: '0.6' }}>
          <div ref={printContainerRef}>
            <UPDPrintTemplate data={documentData} />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
        <p>
          <strong>Примечание:</strong> Это предварительный просмотр печатной формы УПД. 
          Для печати нажмите кнопку "Печать" или скачайте HTML-шаблон для дальнейшего редактирования.
        </p>
      </div>
    </div>
  );
};

export default UPDPrintPreview;
