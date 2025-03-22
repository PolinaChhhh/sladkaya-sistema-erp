
import { ShippingDocument, RussianDocumentType } from '@/store/types/shipping';
import { Buyer } from '@/store/types/buyer';
import { Recipe, ProductionBatch } from '@/store/types/recipe';
import { formatShipmentNumber } from '../../hooks/useShippingUtils';
import { DocumentGenerationData } from './types';

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

/**
 * Generates text content for demonstration purposes
 */
export const generateDocumentContent = (documentType: RussianDocumentType, data: DocumentGenerationData): string => {
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
