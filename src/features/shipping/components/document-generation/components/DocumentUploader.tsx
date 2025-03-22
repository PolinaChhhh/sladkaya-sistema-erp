
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  templateFile: File | null;
  setTemplateFile: (file: File | null) => void;
  isGenerating: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  templateFile,
  setTemplateFile,
  isGenerating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTemplateFile(file);
      toast.success(`Шаблон "${file.name}" загружен`);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Загрузить шаблон (опционально)</label>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isGenerating}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {templateFile ? 'Изменить шаблон' : 'Загрузить шаблон'}
        </Button>
        {templateFile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTemplateFile(null)}
            disabled={isGenerating}
          >
            Удалить
          </Button>
        )}
        <input 
          type="file" 
          accept=".docx,.xls,.xlsx" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>
      
      {templateFile && (
        <p className="text-xs text-green-600 mt-1">
          Загружен шаблон: {templateFile.name}
        </p>
      )}
    </div>
  );
};

export default DocumentUploader;
