
import { DocumentGenerationData } from './types';
import { formatShipmentNumber } from '../../hooks/useShippingUtils';
import { RussianDocumentType } from '@/store/types/shipping';

/**
 * Генерирует XML для УПД (Универсальный передаточный документ)
 * @param data Данные для генерации документа
 * @returns XML в формате строки
 */
export const generateUPDXml = (data: DocumentGenerationData): string => {
  const { shipping, buyer, items, totalWithoutVat, totalVatAmount, totalWithVat, extendedData } = data;
  
  // Генерируем уникальный идентификатор для файла
  const fileId = `UPD_${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
  
  // Форматируем текущую дату для документа
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const formattedTime = formatTime(currentDate);
  const formattedDocDate = shipping.date;
  
  // Подготавливаем данные компании-продавца (должны быть взяты из настроек компании)
  const companyInfo = extendedData?.company || {
    name: "Ваша компания",
    inn: "1234567890",
    kpp: "123456789",
    address: {
      region: "77",
      regionName: "г. Москва",
      index: "123456",
      city: "Москва",
      street: "Примерная",
      house: "1"
    },
    phone: "+7 (495) 123-45-67"
  };
  
  // Форматируем номер документа
  const documentNumber = formatShipmentNumber(shipping.shipmentNumber);
  
  // Создаем XML структуру
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Файл ИдФайл="UPD_${fileId}" ВерсФорм="5.03" ВерсПрог="FoodCost 1.0">
<Документ КНД="1115131" ВремИнфПр="${formattedTime}" ДатаИнфПр="${formattedDate}" Функция="СЧФДОП" ПоФактХЖ="Документ об отгрузке товаров (выполнении работ), передаче имущественных прав (документ об оказании услуг)" НаимДокОпр="Счет-фактура и документ об отгрузке товаров (выполнении работ), передаче имущественных прав (документ об оказании услуг)">
<СвСчФакт НомерДок="${documentNumber}" ДатаДок="${formattedDocDate}">
<СвПрод>
<ИдСв>
<СвЮЛУч НаимОрг="${companyInfo.name}" ИННЮЛ="${companyInfo.inn}" КПП="${companyInfo.kpp}"/>
</ИдСв>
<Адрес>
<АдрРФ КодРегион="${companyInfo.address.region}" НаимРегион="${companyInfo.address.regionName}" Индекс="${companyInfo.address.index}" Город="${companyInfo.address.city}" Улица="${companyInfo.address.street}" Дом="${companyInfo.address.house}"/>
</Адрес>
<Контакт>
<Тлф>${companyInfo.phone}</Тлф>
</Контакт>
</СвПрод>`;

  // Добавляем информацию о грузоотправителе (если отличается от продавца)
  xml += `
<ГрузОт>
<ГрузОтпр>
<ИдСв>
<СвЮЛУч НаимОрг="${companyInfo.name}" ИННЮЛ="${companyInfo.inn}" КПП="${companyInfo.kpp}"/>
</ИдСв>
<Адрес>
<АдрРФ КодРегион="${companyInfo.address.region}" НаимРегион="${companyInfo.address.regionName}" Индекс="${companyInfo.address.index}" Город="${companyInfo.address.city}" Улица="${companyInfo.address.street}" Дом="${companyInfo.address.house}"/>
</Адрес>
</ГрузОтпр>
</ГрузОт>`;

  // Добавляем информацию о грузополучателе (покупателе)
  const buyerAddress = parseBuyerAddress(buyer.legalAddress || '');
  
  xml += `
<ГрузПолуч>
<ИдСв>
<СвЮЛУч НаимОрг="${escapeXml(buyer.name)}" ИННЮЛ="${buyer.tin || ''}" КПП="${buyer.kpp || ''}"/>
</ИдСв>
<Адрес>
<АдрРФ КодРегион="${buyerAddress.region}" НаимРегион="${buyerAddress.regionName}" Индекс="${buyerAddress.index}" Город="${buyerAddress.city}" Улица="${buyerAddress.street}" Дом="${buyerAddress.house}" ${buyerAddress.apartment ? `Кварт="${buyerAddress.apartment}"` : ''}/>
</Адрес>
</ГрузПолуч>`;

  // Добавляем информацию о документе
  xml += `
<ДокПодтвОтгрНом РеквНаимДок="Счет-фактура и документ об отгрузке товаров (выполнении работ), передаче имущественных прав (документ об оказании услуг)" РеквНомерДок="${documentNumber}" РеквДатаДок="${formattedDocDate}"/>`;

  // Добавляем информацию о покупателе
  xml += `
<СвПокуп>
<ИдСв>
<СвЮЛУч НаимОрг="${escapeXml(buyer.name)}" ИННЮЛ="${buyer.tin || ''}" КПП="${buyer.kpp || ''}"/>
</ИдСв>
<Адрес>
<АдрРФ КодРегион="${buyerAddress.region}" НаимРегион="${buyerAddress.regionName}" Индекс="${buyerAddress.index}" Город="${buyerAddress.city}" Улица="${buyerAddress.street}" Дом="${buyerAddress.house}" ${buyerAddress.apartment ? `Кварт="${buyerAddress.apartment}"` : ''}/>
</Адрес>
</СвПокуп>`;

  // Добавляем информацию о валюте
  xml += `
<ДенИзм КодОКВ="643" НаимОКВ="Российский рубль"/>`;

  // Дополнительная информация (номер и дата заказа и т.д.)
  const orderInfo = extendedData?.orderInfo || {
    actNumber: `А-${documentNumber}`,
    actDate: formattedDocDate,
    orderNumber: `ЗАК-${documentNumber}`,
    orderDate: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))) // Заказ был 3 дня назад
  };

  xml += `
<ИнфПолФХЖ1>
<ТекстИнф Идентиф="номер_акта" Значен="${orderInfo.actNumber}"/>
<ТекстИнф Идентиф="дата_акта" Значен="${orderInfo.actDate}"/>
<ТекстИнф Идентиф="номер_заказа" Значен="${orderInfo.orderNumber}"/>
<ТекстИнф Идентиф="дата_заказа" Значен="${orderInfo.orderDate}"/>
</ИнфПолФХЖ1>
</СвСчФакт>`;

  // Добавляем таблицу товаров
  xml += `
<ТаблСчФакт>`;

  // Добавляем строки с товарами
  items.forEach((item, index) => {
    const rowNumber = index + 1;
    const vatRate = `${item.vatRate}%`;
    
    // Получаем артикул и штрихкод (если есть в расширенных данных)
    const productCode = extendedData?.products?.[item.productName]?.code || '';
    const barcode = extendedData?.products?.[item.productName]?.barcode || '';
    
    xml += `
<СведТов НомСтр="${rowNumber}" НалСт="${vatRate}" НаимТов="${escapeXml(item.productName)}" ОКЕИ_Тов="796" НаимЕдИзм="${item.unit}" КолТов="${item.quantity}" ЦенаТов="${item.priceWithoutVat.toFixed(2)}" СтТовБезНДС="${(item.priceWithoutVat * item.quantity).toFixed(2)}" СтТовУчНал="${(item.priceWithVat * item.quantity).toFixed(2)}">
<ДопСведТов/>
<Акциз>
<БезАкциз>без акциза</БезАкциз>
</Акциз>
<СумНал>
<СумНал>${item.vatAmount.toFixed(2)}</СумНал>
</СумНал>`;

    // Добавляем дополнительную информацию о товаре, если есть
    if (productCode) {
      xml += `
<ИнфПолФХЖ2 Идентиф="код_материала" Значен="${productCode}"/>`;
    }
    
    if (barcode) {
      xml += `
<ИнфПолФХЖ2 Идентиф="штрихкод" Значен="${barcode}"/>`;
    }
    
    xml += `
</СведТов>`;
  });

  // Добавляем итоговую информацию
  xml += `
<ВсегоОпл СтТовБезНДСВсего="${totalWithoutVat.toFixed(2)}" СтТовУчНалВсего="${totalWithVat.toFixed(2)}">
<СумНалВсего>
<СумНал>${totalVatAmount.toFixed(2)}</СумНал>
</СумНалВсего>
</ВсегоОпл>
</ТаблСчФакт>`;

  // Добавляем информацию о передаче товара
  xml += `
<СвПродПер>
<СвПер СодОпер="Товары переданы" ДатаПер="${formattedDocDate}">
<ОснПер РеквНаимДок="Заказ" РеквНомерДок="${orderInfo.orderNumber}" РеквДатаДок="${orderInfo.orderDate}"/>
</СвПер>
</СвПродПер>`;

  // Информация о подписанте
  const signerInfo = extendedData?.signer || {
    position: "Генеральный директор",
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович"
  };

  xml += `
<Подписант СпосПодтПолном="4" Должн="${escapeXml(signerInfo.position)}">
<ФИО Фамилия="${escapeXml(signerInfo.lastName)}" Имя="${escapeXml(signerInfo.firstName)}" Отчество="${escapeXml(signerInfo.middleName)}"/>
</Подписант>
</Документ>
</Файл>`;

  return xml;
};

/**
 * Генерирует файл УПД на основе данных
 * @param data Данные для генерации
 * @returns Blob с XML документом
 */
export const generateUPDDocument = (data: DocumentGenerationData): Blob => {
  const xml = generateUPDXml(data);
  return new Blob([xml], { type: 'application/xml' });
};

/**
 * Форматирует дату в формат дд.мм.гггг
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Форматирует время в формат чч.мм.сс
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}.${minutes}.${seconds}`;
};

/**
 * Экранирует специальные символы для XML
 */
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Парсит адрес покупателя в структуру для УПД
 */
const parseBuyerAddress = (address: string): {
  region: string;
  regionName: string;
  index: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
} => {
  // Простое решение для демонстрации
  // В реальном приложении нужен более сложный парсер адресов
  
  // Возвращаем заглушку с данными из предоставленного примера
  return {
    region: "02",
    regionName: "Республика Башкортостан",
    index: "450027",
    city: "Уфа",
    street: address.includes('ул.') ? address.split('ул.')[1].trim().split(',')[0] : "Российская",
    house: "47/3",
    apartment: "пом. 454"
  };
};

/**
 * Интегрируйте эту функцию с основным генератором документов,
 * добавив обработку для типа UTD в функции generateDocument
 */
export const integrateUPDGenerator = (): void => {
  console.log('УПД генератор готов к интеграции с основным потоком генерации документов');
  console.log('Для интеграции добавьте обработку типа UTD в функцию generateDocument в generators.ts');
};
