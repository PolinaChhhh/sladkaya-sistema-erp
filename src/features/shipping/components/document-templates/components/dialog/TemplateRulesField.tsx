
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Clipboard, Info } from 'lucide-react';
import { toast } from 'sonner';

interface TemplateRulesFieldProps {
  rules: string;
  onChange: (value: string) => void;
}

const TemplateRulesField: React.FC<TemplateRulesFieldProps> = ({ rules, onChange }) => {
  // Шаблоны правил для быстрой вставки
  const basicRulesTemplate = `{
  "rules": [
    {"placeholder": "{{shipping.number}}", "field": "shipping.shipmentNumber"},
    {"placeholder": "{{shipping.date}}", "field": "shipping.date"},
    {"placeholder": "{{company.name}}", "field": "company.name"},
    {"placeholder": "{{company.tin}}", "field": "company.tin"},
    {"placeholder": "{{company.address}}", "field": "company.legalAddress"},
    {"placeholder": "{{company.physical_address}}", "field": "company.physicalAddress"},
    {"placeholder": "{{buyer.name}}", "field": "buyer.name"},
    {"placeholder": "{{buyer.tin}}", "field": "buyer.tin"},
    {"placeholder": "{{buyer.kpp}}", "field": "buyer.kpp"},
    {"placeholder": "{{buyer.address}}", "field": "buyer.legalAddress"},
    {"placeholder": "{{buyer.legal_address}}", "field": "buyer.legalAddress"},
    {"placeholder": "{{buyer.physical_address}}", "field": "buyer.physicalAddress"}
  ]
}`;

  const excelTableRulesTemplate = `{
  "rules": [
    {"placeholder": "{{shipping.number}}", "field": "shipping.shipmentNumber"},
    {"placeholder": "{{company.name}}", "field": "company.name"},
    {"placeholder": "{{company.address}}", "field": "company.legalAddress"},
    {"placeholder": "{{company.physical_address}}", "field": "company.physicalAddress"},
    {"placeholder": "{{buyer.name}}", "field": "buyer.name"},
    {"placeholder": "{{buyer.legal_address}}", "field": "buyer.legalAddress"},
    {"placeholder": "{{buyer.physical_address}}", "field": "buyer.physicalAddress"},
    {
      "type": "table",
      "startRow": 10,
      "sheet": "Sheet1",
      "items": "items",
      "fields": [
        {"column": "A", "field": "productName"},
        {"column": "B", "field": "quantity"},
        {"column": "C", "field": "unit"},
        {"column": "D", "field": "priceWithoutVat"},
        {"column": "E", "field": "vatRate"},
        {"column": "F", "field": "vatAmount"},
        {"column": "G", "field": "totalAmount"}
      ]
    },
    {"placeholder": "{{total_no_vat}}", "field": "totalWithoutVat"},
    {"placeholder": "{{total_vat}}", "field": "totalVatAmount"},
    {"placeholder": "{{total_with_vat}}", "field": "totalWithVat"}
  ]
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Шаблон скопирован в буфер обмена');
  };

  const insertTemplate = (template: string) => {
    onChange(template);
    toast.success('Шаблон правил добавлен');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Правила подстановки (JSON)</label>
      <Textarea 
        value={rules} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder='{"rules": []}'
        rows={8}
        className="font-mono text-xs"
      />
      
      <div className="flex gap-2 items-center">
        <div className="text-xs text-gray-500 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          Шаблоны правил:
        </div>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 px-2"
          onClick={() => insertTemplate(basicRulesTemplate)}
        >
          Базовые правила
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 px-2"
          onClick={() => insertTemplate(excelTableRulesTemplate)}
        >
          Excel с таблицей
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          className="text-xs h-7 px-2 ml-auto"
          onClick={() => copyToClipboard(rules)}
        >
          <Clipboard className="h-3 w-3 mr-1" />
          Копировать
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">
        Задает правила подстановки данных в шаблон документа в формате JSON.
        Подробное руководство доступно на странице шаблонов.
      </p>
    </div>
  );
};

export default TemplateRulesField;
