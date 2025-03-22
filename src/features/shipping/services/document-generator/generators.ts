import { RussianDocumentType } from '@/store/types/shipping';
import { DocumentGenerationData } from './types';
import { formatShipmentNumber } from '../../hooks/useShippingUtils';
import { documentTemplates, getDocumentTemplate } from './templates';
import { generateDocumentContent } from './utils';

/**
 * Generates a document from a template file
 */
const generateFromTemplate = async (
  documentType: RussianDocumentType,
  template: File,
  data: DocumentGenerationData,
  format: 'word' | 'excel'
): Promise<Blob> => {
  console.log(`Generating ${format} document from template for ${documentType}`);
  
  try {
    // In a real implementation, we would use a library to fill the template
    // For Excel templates, we might use SheetJS/xlsx
    // For Word templates, we might use docxtemplater
    
    // For now, we'll read the template file and return it unchanged
    // In a production environment, this would be replaced with actual template filling
    const arrayBuffer = await template.arrayBuffer();
    
    // For demonstration purposes, we'll just return the template file
    // In a real implementation, you would process the template here
    return new Blob([arrayBuffer], { 
      type: format === 'excel' 
        ? 'application/vnd.ms-excel' 
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  } catch (error) {
    console.error('Error generating document from template:', error);
    throw new Error('Failed to generate document from template');
  }
};

/**
 * Generates a Word document
 */
const generateWordDocument = async (
  documentType: RussianDocumentType,
  data: DocumentGenerationData
): Promise<Blob> => {
  // In a real implementation, this would use a library like docxtemplater
  // For now, we'll simulate the document generation
  
  // Get template based on document type
  const template = await getDocumentTemplate(documentType);
  
  // In a real implementation, we would populate the template with data
  // For demonstration purposes, we'll create a simple text representation
  const documentContent = generateDocumentContent(documentType, data);
  
  // Create a Blob containing the document content
  const blob = new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  return blob;
};

/**
 * Generates an Excel document
 */
export const generateExcelDocument = async (
  documentType: RussianDocumentType,
  data: DocumentGenerationData
): Promise<Blob> => {
  // In a real implementation, we would use a library like xlsx or exceljs
  const { shipping, buyer, items, totalWithoutVat, totalVatAmount, totalWithVat } = data;
  
  // Create a binary string representing an XLS format
  let xlsContent = "";
  
  // Excel document begins with a header
  xlsContent += "\uFEFF"; // UTF-8 BOM for Excel compatibility
  
  // Header rows with document info
  xlsContent += "Документ:\t" + documentType + "\tНомер:\t" + formatShipmentNumber(shipping.shipmentNumber) + "\r\n";
  xlsContent += "Дата:\t" + shipping.date + "\r\n";
  xlsContent += "Покупатель:\t" + buyer.name + "\r\n";
  
  if (buyer.tin) xlsContent += "ИНН:\t" + buyer.tin + "\r\n";
  if (buyer.legalAddress) xlsContent += "Юридический адрес:\t" + buyer.legalAddress + "\r\n";
  
  // Empty row as separator
  xlsContent += "\r\n";
  
  // Column headers for items table
  xlsContent += "№\tНаименование\tКоличество\tЕд. изм.\tЦена без НДС\tСтавка НДС\tСумма НДС\tЦена с НДС\tИтого\r\n";
  
  // Items
  items.forEach((item, index) => {
    xlsContent += [
      index + 1,
      item.productName,
      item.quantity,
      item.unit,
      item.priceWithoutVat.toFixed(2),
      item.vatRate + "%",
      item.vatAmount.toFixed(2),
      item.priceWithVat.toFixed(2),
      item.totalAmount.toFixed(2)
    ].join("\t") + "\r\n";
  });
  
  // Empty row as separator
  xlsContent += "\r\n";
  
  // Totals
  xlsContent += "\t\t\t\t\t\t\tИтого без НДС:\t" + totalWithoutVat.toFixed(2) + "\r\n";
  xlsContent += "\t\t\t\t\t\t\tСумма НДС:\t" + totalVatAmount.toFixed(2) + "\r\n";
  xlsContent += "\t\t\t\t\t\t\tИтого с НДС:\t" + totalWithVat.toFixed(2) + "\r\n";
  
  // Create a Blob with the XLS content
  const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' });
  
  return blob;
};

/**
 * Generates a document for the specified document type
 */
export const generateDocument = async (
  documentType: RussianDocumentType,
  data: DocumentGenerationData,
  format: 'word' | 'excel' = 'word'
): Promise<Blob> => {
  // Check if we have a template for this document type
  const template = documentTemplates[documentType];
  
  if (template) {
    // If we have a template, use it to generate the document
    return generateFromTemplate(documentType, template, data, format);
  }
  
  // If no template is available, fall back to the built-in generators
  if (format === 'excel') {
    return generateExcelDocument(documentType, data);
  }
  
  // For Word documents
  return generateWordDocument(documentType, data);
};
