
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
  
  // Для ТОРГ-12 добавим дополнительные данные для улучшения шаблонов
  const currentDate = new Date().toLocaleDateString('ru-RU');
  const formattedShipmentNumber = formatShipmentNumber(shipping.shipmentNumber);
  
  // Расширенные данные для ТОРГ-12
  const extendedData = {
    shipping: {
      ...shipping,
      formattedNumber: formattedShipmentNumber,
      formattedDate: shipping.date,
      currentDate
    },
    buyer,
    items,
    totals: {
      withoutVat: totalWithoutVat,
      vatAmount: totalVatAmount,
      withVat: totalWithVat,
      itemsCount: items.length,
      // Текстовое представление суммы прописью (заглушка)
      amountInWords: `${Math.floor(totalWithVat)} руб. ${Math.round((totalWithVat - Math.floor(totalWithVat)) * 100)} коп.`
    }
  };
  
  return {
    shipping,
    buyer,
    items,
    totalWithoutVat,
    totalVatAmount,
    totalWithVat,
    extendedData // Теперь это поле будет соответствовать интерфейсу
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
  format: 'pdf' | 'excel' = 'pdf'
): string => {
  const formattedNumber = formatShipmentNumber(shipmentNumber);
  const sanitizedBuyerName = buyerName.replace(/[^\w\s]/gi, '').substring(0, 20);
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  
  return `${documentType}_${formattedNumber}_${sanitizedBuyerName}.${extension}`;
};

/**
 * Validates substitution rules JSON
 */
export const validateSubstitutionRules = (rulesJson: string): boolean => {
  try {
    const rules = JSON.parse(rulesJson);
    
    if (!rules.rules || !Array.isArray(rules.rules)) {
      return false;
    }
    
    // Проверяем базовую структуру правил
    for (const rule of rules.rules) {
      if (rule.type === 'table') {
        // Проверка правил для таблиц
        if (!rule.items || !rule.fields || !Array.isArray(rule.fields)) {
          return false;
        }
      } else if (!rule.placeholder || !rule.field) {
        // Проверка простых правил замены
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Gets TORG-12 specific template data 
 * This function extracts additional data useful for TORG-12 documents
 */
export const getTORG12TemplateData = (data: DocumentGenerationData): Record<string, any> => {
  const { shipping, buyer, items, totalWithVat } = data;
  
  return {
    documentNumber: formatShipmentNumber(shipping.shipmentNumber),
    documentDate: shipping.date,
    currentDate: new Date().toLocaleDateString('ru-RU'),
    supplierName: "Ваша компания", // Это должно быть взято из настроек компании
    supplierTIN: "1234567890", // Это должно быть взято из настроек компании
    buyerName: buyer.name,
    buyerTIN: buyer.tin || "",
    buyerAddress: buyer.legalAddress || "",
    items: items.map((item, index) => ({
      ...item,
      number: index + 1, // Номер по порядку
      totalPrice: item.priceWithoutVat * item.quantity // Общая стоимость без НДС
    })),
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: totalWithVat,
    amountInWords: `${Math.floor(totalWithVat)} руб. ${Math.round((totalWithVat - Math.floor(totalWithVat)) * 100)} коп.`,
    // Подписи для ТОРГ-12
    signatures: {
      supplier: {
        position: "Генеральный директор",
        name: "Иванов И.И."
      },
      recipient: {
        position: "",
        name: ""
      }
    }
  };
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
