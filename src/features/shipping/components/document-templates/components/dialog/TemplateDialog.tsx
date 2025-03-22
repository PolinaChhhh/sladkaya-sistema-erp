
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RussianDocumentType } from '@/store/types/shipping';
import { DocumentTemplate } from '../../types';
import { toast } from 'sonner';

// Import sub-components
import TemplateNameField from './TemplateNameField';
import TemplateTypeFormatFields from './TemplateTypeFormatFields';
import TemplateDescriptionField from './TemplateDescriptionField';
import TemplateFileUpload from './TemplateFileUpload';
import TemplateRulesField from './TemplateRulesField';

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<DocumentTemplate>;
  setFormData: (data: Partial<DocumentTemplate>) => void;
  templateFile: File | null;
  setTemplateFile: (file: File | null) => void;
  onSave: () => void;
  isEdit: boolean;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  templateFile,
  setTemplateFile,
  onSave,
  isEdit
}) => {
  const handleSave = () => {
    // Validate
    if (!formData.name?.trim()) {
      toast.error('Введите название шаблона');
      return;
    }
    
    if (!templateFile) {
      toast.error('Загрузите файл шаблона');
      return;
    }
    
    try {
      // Validate JSON rules
      if (formData.substitutionRules) {
        JSON.parse(formData.substitutionRules);
      }
      
      // Save template
      onSave();
    } catch (e) {
      toast.error('Ошибка в формате правил подстановки (JSON)');
    }
  };
  
  const updateFormField = <K extends keyof DocumentTemplate>(
    field: K, 
    value: DocumentTemplate[K]
  ) => {
    setFormData({...formData, [field]: value});
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактирование шаблона' : 'Создание шаблона документа'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <TemplateNameField 
            name={formData.name || ''} 
            onChange={(value) => updateFormField('name', value)} 
          />
          
          <TemplateTypeFormatFields 
            type={formData.type}
            format={formData.format}
            onTypeChange={(value) => updateFormField('type', value)}
            onFormatChange={(value) => updateFormField('format', value)}
          />
          
          <TemplateDescriptionField 
            description={formData.description || ''} 
            onChange={(value) => updateFormField('description', value)} 
          />
          
          <TemplateFileUpload 
            templateFile={templateFile} 
            onChange={(file) => setTemplateFile(file)} 
          />
          
          <TemplateRulesField 
            rules={formData.substitutionRules || '{"rules": []}'}
            onChange={(value) => updateFormField('substitutionRules', value)} 
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? 'Сохранить изменения' : 'Создать шаблон'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
