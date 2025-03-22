
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TemplateRulesFieldProps {
  rules: string;
  onChange: (value: string) => void;
}

const TemplateRulesField: React.FC<TemplateRulesFieldProps> = ({ rules, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Правила подстановки (JSON)</label>
      <Textarea 
        value={rules} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder='{"rules": []}'
        rows={4}
        className="font-mono text-xs"
      />
      <p className="text-xs text-gray-500">
        Задает правила подстановки данных в шаблон документа в формате JSON
      </p>
    </div>
  );
};

export default TemplateRulesField;
