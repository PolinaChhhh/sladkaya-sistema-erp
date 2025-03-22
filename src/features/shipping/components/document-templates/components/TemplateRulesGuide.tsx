
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TemplateRulesGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          Руководство по созданию шаблонов
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Скрыть
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Показать
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Как создать шаблон документа</h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Создайте документ в Excel или Word с плейсхолдерами для данных</li>
                <li>Плейсхолдеры должны иметь формат <code className="bg-gray-100 px-1 rounded">{'{{имя_поля}}'}</code></li>
                <li>Загрузите документ в систему и укажите правила подстановки в формате JSON</li>
                <li>При генерации документа плейсхолдеры будут заменены на реальные данные</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Доступные данные для шаблонов</h4>
              <p className="text-sm mb-3">В шаблонах доступны следующие данные:</p>
              
              <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
                <h5 className="font-medium">Основные данные</h5>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><code>shipping.shipmentNumber</code> - номер отгрузки</li>
                  <li><code>shipping.date</code> - дата отгрузки</li>
                  <li><code>shipping.status</code> - статус отгрузки</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
                <h5 className="font-medium">Данные покупателя (buyer)</h5>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><code>buyer.name</code> - название компании</li>
                  <li><code>buyer.tin</code> - ИНН</li>
                  <li><code>buyer.legalAddress</code> - юридический адрес</li>
                  <li><code>buyer.contactPerson</code> - контактное лицо</li>
                  <li><code>buyer.phone</code> - телефон</li>
                  <li><code>buyer.email</code> - электронная почта</li>
                  <li><code>buyer.bankDetails</code> - банковские реквизиты</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
                <h5 className="font-medium">Товарные позиции (items)</h5>
                <p className="text-xs mb-1 italic">Для таблицы товаров, где каждая строка соответствует одному товару</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><code>productName</code> - название продукта</li>
                  <li><code>quantity</code> - количество</li>
                  <li><code>unit</code> - единица измерения</li>
                  <li><code>priceWithoutVat</code> - цена без НДС</li>
                  <li><code>vatRate</code> - ставка НДС в процентах</li>
                  <li><code>vatAmount</code> - сумма НДС</li>
                  <li><code>priceWithVat</code> - цена с НДС</li>
                  <li><code>totalAmount</code> - общая сумма (с НДС)</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <h5 className="font-medium">Итоговые суммы</h5>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><code>totalWithoutVat</code> - сумма без НДС</li>
                  <li><code>totalVatAmount</code> - общая сумма НДС</li>
                  <li><code>totalWithVat</code> - итоговая сумма с НДС</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Формат правил подстановки (JSON)</h4>
              <p className="text-sm mb-3">Пример правил подстановки для Excel-документа:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "rules": [
    // Простые замены
    {"placeholder": "{{shipping.number}}", "field": "shipping.shipmentNumber"},
    {"placeholder": "{{buyer.name}}", "field": "buyer.name"},
    {"placeholder": "{{buyer.tin}}", "field": "buyer.tin"},
    
    // Таблица товаров
    {
      "type": "table",
      "startRow": 10,     // Начальная строка для таблицы
      "endRow": 20,       // Конечная строка (опционально)
      "sheet": "Sheet1",  // Имя листа в Excel (опционально)
      "items": "items",   // Массив элементов для таблицы
      "fields": [
        {"column": "A", "field": "productName"},
        {"column": "B", "field": "quantity"},
        {"column": "C", "field": "unit"},
        {"column": "D", "field": "priceWithoutVat", "format": "number:2"},
        {"column": "E", "field": "vatRate", "format": "percent"},
        {"column": "F", "field": "vatAmount", "format": "number:2"},
        {"column": "G", "field": "totalAmount", "format": "number:2"}
      ]
    },
    
    // Итоговые суммы
    {"placeholder": "{{total_no_vat}}", "field": "totalWithoutVat", "format": "number:2"},
    {"placeholder": "{{total_vat}}", "field": "totalVatAmount", "format": "number:2"},
    {"placeholder": "{{total_with_vat}}", "field": "totalWithVat", "format": "number:2"}
  ]
}`}
              </pre>
              
              <p className="text-sm mt-3">Пример правил подстановки для Word-документа:</p>
              
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "rules": [
    // Простые замены для текстовых полей
    {"placeholder": "{{shipping_number}}", "field": "shipping.shipmentNumber"},
    {"placeholder": "{{shipping_date}}", "field": "shipping.date"},
    {"placeholder": "{{buyer_name}}", "field": "buyer.name"},
    
    // Таблица товаров
    {
      "type": "table",
      "tableName": "ProductsTable",  // Имя таблицы в Word
      "items": "items",              // Массив элементов для таблицы
      "fields": [
        {"columnName": "Наименование", "field": "productName"},
        {"columnName": "Количество", "field": "quantity"},
        {"columnName": "Ед. изм.", "field": "unit"},
        {"columnName": "Цена без НДС", "field": "priceWithoutVat"},
        {"columnName": "Ставка НДС", "field": "vatRate"},
        {"columnName": "Сумма НДС", "field": "vatAmount"},
        {"columnName": "Сумма с НДС", "field": "totalAmount"}
      ]
    }
  ]
}`}
              </pre>
              
              <p className="text-sm mt-3 text-gray-500">
                Примечание: Текущая реализация подстановки данных в шаблоны является базовой. 
                В реальном проекте может потребоваться использование библиотек для работы с Excel или Word.
              </p>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-blue-50 rounded-md text-blue-800 text-sm">
            <p className="font-medium">Совет по ТОРГ-12</p>
            <p className="mt-1">
              Для создания шаблона ТОРГ-12 рекомендуется начать с готового бланка ТОРГ-12 в формате Excel 
              и добавить в него плейсхолдеры в соответствующих ячейках. Затем загрузить его в систему и 
              настроить правила подстановки.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateRulesGuide;
