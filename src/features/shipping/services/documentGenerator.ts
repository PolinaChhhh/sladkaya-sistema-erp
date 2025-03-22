import { ShippingDocument, RussianDocumentType } from '@/store/types/shipping';
import { Buyer } from '@/store/types/buyer';
import { Recipe, ProductionBatch } from '@/store/types/recipe';
import { formatShipmentNumber } from '../hooks/useShippingUtils';

// VAT rate options as per Russian legislation
export const VAT_RATES = [0, 5, 7, 10, 20];

// Interface for document generation
export interface DocumentGenerationData {
  shipping: ShippingDocument;
  buyer: Buyer;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
    priceWithoutVat: number;
    vatRate: number;
    vatAmount: number;
    priceWithVat: number;
    totalAmount: number;
  }>;
  totalWithoutVat: number;
  totalVatAmount: number;
  totalWithVat: number;
}

// Store templates for document types
const documentTemplates: Record<RussianDocumentType, File | null> = {
  TORG12: null,
  UTD: null,
  TTN: null,
  TN: null
};

/**
 * Set a template file for a specific document type
 */
export const setDocumentTemplate = async (
  documentType: RussianDocumentType,
  file: File
): Promise<void> => {
  documentTemplates[documentType] = file;
  console.log(`Template set for ${documentType}:`, file.name);
};

/**
 * Prepares data required for document generation
 */
export const prepareDocumentData = (
  shipping: ShippingDocument, 
  buyer: Buyer,
  productions: ProductionBatch[],
  recipes: Recipe[]
): DocumentGenerationData => {
  // Calculate totals
  let totalWithoutVat = 0;
  let totalVatAmount = 0;
  let totalWithVat = 0;
  
  // Process each item to get complete information
  const items = shipping.items.map(item => {
    // Find production batch and recipe
    const production = productions.find(p => p.id === item.productionBatchId);
    const recipe = production ? recipes.find(r => r.id === production.recipeId) : null;
    
    // Calculate amounts
    const priceWithoutVat = item.price;
    const vatAmount = priceWithoutVat * (item.vatRate / 100) * item.quantity;
    const priceWithVat = priceWithoutVat * (1 + item.vatRate / 100);
    const totalAmount = priceWithVat * item.quantity;
    
    // Accumulate totals
    totalWithoutVat += priceWithoutVat * item.quantity;
    totalVatAmount += vatAmount;
    totalWithVat += totalAmount;
    
    return {
      productName: recipe?.name || 'Неизвестный продукт',
      quantity: item.quantity,
      unit: recipe?.outputUnit || 'шт',
      priceWithoutVat,
      vatRate: item.vatRate,
      vatAmount,
      priceWithVat,
      totalAmount
    };
  });
  
  return {
    shipping,
    buyer,
    items,
    totalWithoutVat,
    totalVatAmount,
    totalWithVat
  };
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
 * Gets the appropriate template for the document type
 */
const getDocumentTemplate = async (documentType: RussianDocumentType): Promise<string> => {
  // In a real implementation, this would load the actual template
  // For now, we'll return a placeholder
  return `Template for ${documentType}`;
};

/**
 * Generates text content for demonstration purposes
 */
const generateDocumentContent = (documentType: RussianDocumentType, data: DocumentGenerationData): string => {
  const { shipping, buyer, items, totalWithoutVat, totalVatAmount, totalWithVat } = data;
  
  let content = `====== DOCUMENT: ${documentType} ======\n\n`;
  
  // Header information
  content += `Document Number: ${formatShipmentNumber(shipping.shipmentNumber)}\n`;
  content += `Date: ${shipping.date}\n`;
  content += `Buyer: ${buyer.name}\n`;
  if (buyer.tin) content += `TIN: ${buyer.tin}\n`;
  if (buyer.legalAddress) content += `Legal Address: ${buyer.legalAddress}\n`;
  
  content += '\n==== ITEMS ====\n\n';
  
  // Items table
  items.forEach((item, index) => {
    content += `${index + 1}. ${item.productName}\n`;
    content += `   Quantity: ${item.quantity} ${item.unit}\n`;
    content += `   Price (without VAT): ${item.priceWithoutVat.toFixed(2)} ₽\n`;
    content += `   VAT Rate: ${item.vatRate}%\n`;
    content += `   VAT Amount: ${item.vatAmount.toFixed(2)} ₽\n`;
    content += `   Price (with VAT): ${item.priceWithVat.toFixed(2)} ₽\n`;
    content += `   Total: ${item.totalAmount.toFixed(2)} ₽\n\n`;
  });
  
  // Totals
  content += '==== TOTALS ====\n\n';
  content += `Total (without VAT): ${totalWithoutVat.toFixed(2)} ₽\n`;
  content += `Total VAT: ${totalVatAmount.toFixed(2)} ₽\n`;
  content += `Total (with VAT): ${totalWithVat.toFixed(2)} ₽\n`;
  
  return content;
};

/**
 * Downloads the generated document
 */
export const downloadDocument = (blob: Blob, fileName: string): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
};

/**
 * Builds a filename for the document
 */
export const buildDocumentFileName = (
  documentType: RussianDocumentType,
  shipmentNumber: number,
  buyerName: string,
  format: 'word' | 'excel' = 'word'
): string => {
  const formattedNumber = formatShipmentNumber(shipmentNumber);
  const sanitizedBuyerName = buyerName.replace(/[^\w\s]/gi, '').substring(0, 20);
  const extension = format === 'excel' ? 'xls' : 'docx';
  
  return `${documentType}_${formattedNumber}_${sanitizedBuyerName}.${extension}`;
};
