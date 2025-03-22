
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RussianDocumentType } from '@/store/types/shipping';

const documentTypeOptions = [
  { value: 'TORG12', label: 'ТОРГ-12 (Товарная накладная)' },
  { value: 'UTD', label: 'УПД (Универсальный передаточный документ)' },
  { value: 'TTN', label: 'ТТН (Товарно-транспортная накладная)' },
  { value: 'TN', label: 'ТН (Товарная накладная)' }
];

interface DocumentSelectorProps {
  selectedType: RussianDocumentType;
  onTypeChange: (type: RussianDocumentType) => void;
  disabled?: boolean;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Тип документа</label>
      <Select 
        value={selectedType} 
        onValueChange={(value) => onTypeChange(value as RussianDocumentType)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите тип документа" />
        </SelectTrigger>
        <SelectContent>
          {documentTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentSelector;
