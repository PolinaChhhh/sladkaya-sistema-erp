
import React from 'react';
import { Input } from '@/components/ui/input';

interface TemplateNameFieldProps {
  name: string;
  onChange: (value: string) => void;
}

const TemplateNameField: React.FC<TemplateNameFieldProps> = ({ name, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Название шаблона</label>
      <Input 
        value={name} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Введите название шаблона"
      />
    </div>
  );
};

export default TemplateNameField;
