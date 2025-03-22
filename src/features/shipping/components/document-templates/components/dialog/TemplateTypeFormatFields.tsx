
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RussianDocumentType } from '@/store/types/shipping';

interface TemplateTypeFormatFieldsProps {
  type: RussianDocumentType | undefined;
  format: 'word' | 'excel' | undefined;
  onTypeChange: (value: RussianDocumentType) => void;
  onFormatChange: (value: 'word' | 'excel') => void;
}

const TemplateTypeFormatFields: React.FC<TemplateTypeFormatFieldsProps> = ({ 
  type, 
  format, 
  onTypeChange, 
  onFormatChange 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Тип документа</label>
        <Select 
          value={type || 'TORG12'} 
          onValueChange={(value) => onTypeChange(value as RussianDocumentType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TORG12">ТОРГ-12</SelectItem>
            <SelectItem value="UTD">УПД</SelectItem>
            <SelectItem value="TTN">ТТН</SelectItem>
            <SelectItem value="TN">ТН</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Формат документа</label>
        <Select 
          value={format || 'word'} 
          onValueChange={(value) => onFormatChange(value as 'word' | 'excel')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите формат" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="word">Word</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TemplateTypeFormatFields;
