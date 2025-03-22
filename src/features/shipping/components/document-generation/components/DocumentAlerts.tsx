
import React from 'react';
import { RussianDocumentType } from '@/store/types/shipping';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

interface DocumentAlertsProps {
  documentType: RussianDocumentType;
  canGenerate: boolean;
  buyer?: any;
}

const DocumentAlerts: React.FC<DocumentAlertsProps> = ({
  documentType,
  canGenerate,
  buyer
}) => {
  // Определяем, каких данных не хватает
  const getBuyerMissingFields = () => {
    if (!buyer) return ['данные клиента'];
    
    const missingFields = [];
    if (!buyer.name) missingFields.push('название компании');
    if (!buyer.tin) missingFields.push('ИНН');
    if (!buyer.legalAddress) missingFields.push('юр. адрес');
    
    return missingFields;
  };
  
  const missingBuyerFields = getBuyerMissingFields();
  const isBuyerInfoComplete = buyer && missingBuyerFields.length === 0;
  
  // Информационное сообщение для каждого типа документа
  const getDocumentTypeInfo = () => {
    switch (documentType) {
      case 'TORG12':
        return 'ТОРГ-12 (Товарная накладная) - официальный документ для оформления передачи товаров.';
      case 'UTD':
        return 'УПД (Универсальный передаточный документ) - заменяет счет-фактуру и накладную.';
      case 'TTN':
        return 'ТТН (Товарно-транспортная накладная) - документ для перевозки товаров транспортной компанией.';
      case 'TN':
        return 'ТН (Товарная накладная) - упрощенная форма товарной накладной.';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-3">
      {/* Информация о типе документа */}
      <div className="text-sm p-3 bg-blue-50 text-blue-800 rounded-md flex items-start">
        <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p>{getDocumentTypeInfo()}</p>
          {documentType === 'TORG12' && (
            <p className="mt-1 text-xs">
              Для ТОРГ-12 рекомендуется заполнить все данные контрагента, включая ИНН и юридический адрес.
            </p>
          )}
        </div>
      </div>
      
      {/* Предупреждение о недостающих данных */}
      {!canGenerate && (
        <div className="text-sm p-3 bg-amber-50 text-amber-800 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p>Для создания документа необходимы данные клиента и товары</p>
            {missingBuyerFields.length > 0 && (
              <p className="mt-1 text-xs">
                Отсутствуют: {missingBuyerFields.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Информация о готовности к генерации */}
      {canGenerate && (
        <div className="text-sm p-3 bg-green-50 text-green-800 rounded-md flex items-start">
          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p>Все необходимые данные для создания документа заполнены</p>
            {!isBuyerInfoComplete && documentType === 'TORG12' && (
              <p className="mt-1 text-xs">
                Рекомендуется дополнительно указать: {missingBuyerFields.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAlerts;
