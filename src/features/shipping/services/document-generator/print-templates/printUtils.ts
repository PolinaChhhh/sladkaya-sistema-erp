
import { DocumentGenerationData } from '../types';
import { ShippingDocument } from '@/store/types/shipping';
import { Buyer } from '@/store/types/buyer';

/**
 * Утилиты для экспорта и печати документов
 */

/**
 * Генерирует HTML-содержимое для УПД
 */
export const generateUPDHtml = (
  containerHtml: string, 
  shipping: ShippingDocument,
  styles: string = ''
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>УПД №${shipping.shipmentNumber}</title>
        <style>
          ${styles || document.querySelector('style')?.innerHTML || ''}
          @media print {
            body { margin: 0; padding: 0; }
            .upd-print-container { width: 100%; }
          }
        </style>
      </head>
      <body>
        ${containerHtml}
      </body>
    </html>
  `;
};

/**
 * Генерирует данные для Excel-файла из информации УПД
 */
export const generateExcelData = (
  documentData: DocumentGenerationData, 
  shipping: ShippingDocument,
  buyer: Buyer
): string => {
  // Формируем CSV данные для Excel
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
  
  return csvContent;
};

/**
 * Скачивает данные в виде файла
 */
export const downloadDataAsFile = (
  data: string | Blob,
  fileName: string,
  mimeType: string = 'text/plain'
): void => {
  const blob = typeof data === 'string' 
    ? new Blob([data], { type: mimeType }) 
    : data;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Открывает окно печати с HTML-содержимым
 */
export const openPrintWindow = (
  htmlContent: string,
  autoPrint: boolean = true
): Window | null => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return null;
  }
  
  printWindow.document.write(htmlContent);
  
  if (autoPrint) {
    printWindow.document.write(`
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    `);
  }
  
  printWindow.document.close();
  return printWindow;
};
