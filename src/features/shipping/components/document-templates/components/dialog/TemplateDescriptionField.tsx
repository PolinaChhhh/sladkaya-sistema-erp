
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TemplateDescriptionFieldProps {
  description: string;
  onChange: (value: string) => void;
}

const TemplateDescriptionField: React.FC<TemplateDescriptionFieldProps> = ({ description, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Описание</label>
      <Textarea 
        value={description} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Краткое описание шаблона"
        rows={2}
      />
    </div>
  );
};

export default TemplateDescriptionField;
