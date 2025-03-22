
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
 * Generates a Word document for the specified document type
 */
export const generateDocument = async (
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
  buyerName: string
): string => {
  const formattedNumber = formatShipmentNumber(shipmentNumber);
  const sanitizedBuyerName = buyerName.replace(/[^\w\s]/gi, '').substring(0, 20);
  
  return `${documentType}_${formattedNumber}_${sanitizedBuyerName}.docx`;
};
