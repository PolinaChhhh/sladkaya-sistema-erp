
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
    company: {
      name: "Ваша компания", // Это должно быть взято из настроек компании
      tin: "1234567890", // Это должно быть взято из настроек компании
      legalAddress: "г. Москва, ул. Примерная, д. 1", // Это должно быть взято из настроек компании
      physicalAddress: "г. Москва, ул. Примерная, д. 1",
      contactPerson: "Иванов И.И.",
      phone: "+7 (495) 123-45-67",
      email: "info@yourcompany.ru",
      bankDetails: "Р/с 40702810000000000000, АО 'Банк', БИК 044525000, К/с 30101810000000000000"
    },
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
    extendedData
  };
};

/**
 * Gets TORG-12 specific template data 
 * This function extracts additional data useful for TORG-12 documents
 */
export const getTORG12TemplateData = (data: DocumentGenerationData): Record<string, any> => {
  const { shipping, buyer, items, totalWithVat, extendedData } = data;
  
  return {
    documentNumber: formatShipmentNumber(shipping.shipmentNumber),
    documentDate: shipping.date,
    currentDate: new Date().toLocaleDateString('ru-RU'),
    supplierName: extendedData?.company?.name || "Ваша компания",
    supplierTIN: extendedData?.company?.tin || "1234567890",
    supplierAddress: extendedData?.company?.legalAddress || "г. Москва, ул. Примерная, д. 1",
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
        position: extendedData?.company?.contactPerson ? "Генеральный директор" : "Генеральный директор",
        name: extendedData?.company?.contactPerson || "Иванов И.И."
      },
      recipient: {
        position: "",
        name: ""
      }
    }
  };
};
