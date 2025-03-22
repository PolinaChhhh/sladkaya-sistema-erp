
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface TemplateFileUploadProps {
  templateFile: File | null;
  onChange: (file: File) => void;
}

const TemplateFileUpload: React.FC<TemplateFileUploadProps> = ({ templateFile, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Файл шаблона</label>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {templateFile ? 'Изменить файл' : 'Загрузить файл'}
        </Button>
        <input 
          type="file" 
          accept=".docx,.doc,.xlsx,.xls" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>
      {templateFile && (
        <p className="text-xs text-green-600">
          Загружен файл: {templateFile.name}
        </p>
      )}
    </div>
  );
};

export default TemplateFileUpload;
