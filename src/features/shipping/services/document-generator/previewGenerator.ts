
import { RussianDocumentType } from '@/store/types/shipping';
import { DocumentGenerationData } from './types';
import { formatShipmentNumber } from '../../hooks/useShippingUtils';

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
