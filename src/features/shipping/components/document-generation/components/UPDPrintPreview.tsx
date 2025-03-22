
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, FilePlus, FileText } from 'lucide-react';
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
  
  // Функция для экспорта в PDF
  const handleExportPDF = () => {
    if (!buyer) {
      toast.error('Ошибка: Покупатель не найден');
      return;
    }
    
    // Имитация экспорта в PDF (в реальном приложении здесь использовалась бы библиотека)
    toast.promise(
      // Имитация асинхронного процесса
      new Promise(resolve => setTimeout(resolve, 1500)), 
      {
        loading: 'Генерация PDF...',
        success: () => {
          // Вместо имитации здесь бы использовалась html2pdf или jsPDF
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            throw new Error('Пожалуйста, разрешите всплывающие окна');
          }
          
          printWindow.document.write(`
            <html>
              <head>
                <title>УПД №${shipping.shipmentNumber}</title>
                <style>
                  ${document.querySelector('style')?.innerHTML || ''}
                  @media print {
                    body { margin: 0; padding: 0; }
                    .upd-print-container { width: 100%; }
                  }
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
          return 'УПД успешно экспортирован для печати';
        },
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
      // В реальном приложении здесь была бы генерация Excel файла с библиотекой xlsx
      // Сейчас создаем простой CSV для имитации Excel
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Заголовки
      csvContent += "УПД №" + shipping.shipmentNumber + "\r\n";
      csvContent += "Дата: " + shipping.date + "\r\n";
      csvContent += "Покупатель: " + buyer.name + "\r\n\r\n";
      
      // Таблица товаров
      csvContent += "№,Наименование,Количество,Ед. изм.,Цена без НДС,Ставка НДС,Сумма НДС,Всего с НДС\r\n";
      
      documentData.items.forEach((item, index) => {
        csvContent += [
          index + 1,
          item.productName,
          item.quantity,
          item.unit,
          item.priceWithoutVat.toFixed(2),
          item.vatRate + "%",
          item.vatAmount.toFixed(2),
          item.totalAmount.toFixed(2)
        ].join(",") + "\r\n";
      });
      
      // Итоги
      csvContent += "\r\n";
      csvContent += ",,,,,,Итого без НДС:," + documentData.totalWithoutVat.toFixed(2) + "\r\n";
      csvContent += ",,,,,,Сумма НДС:," + documentData.totalVatAmount.toFixed(2) + "\r\n";
      csvContent += ",,,,,,Итого с НДС:," + documentData.totalWithVat.toFixed(2) + "\r\n";
      
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
          <FileText className="h-4 w-4 mr-2" />
          Скачать Excel
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
          Вы можете распечатать его напрямую, скачать в формате PDF для печати или Excel для редактирования.
        </p>
      </div>
    </div>
  );
};

export default UPDPrintPreview;
