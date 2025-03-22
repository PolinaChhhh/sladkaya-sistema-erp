
import { useState } from 'react';
import { DocumentTemplate } from '../types';
import { toast } from 'sonner';
import { RussianDocumentType } from '@/store/types/shipping';

export const useTemplatesList = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  
  // Form state for new/edited template
  const [formData, setFormData] = useState<Partial<DocumentTemplate>>({
    name: '',
    type: 'TORG12',
    format: 'excel',
    description: '',
    substitutionRules: ''
  });
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  
  const handleUploadClick = () => {
    setFormData({
      name: '',
      type: 'TORG12',
      format: 'excel',
      description: '',
      substitutionRules: ''
    });
    setTemplateFile(null);
    setIsUploadDialogOpen(true);
  };
  
  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      format: template.format,
      description: template.description,
      substitutionRules: template.substitutionRules
    });
    setTemplateFile(template.file);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success('Шаблон удален');
  };
  
  const handleSaveTemplate = () => {
    if (!templateFile) {
      toast.error('Необходимо загрузить файл шаблона');
      return;
    }
    
    if (!formData.name) {
      toast.error('Необходимо указать название шаблона');
      return;
    }
    
    const newTemplate: DocumentTemplate = {
      id: selectedTemplate?.id || crypto.randomUUID(),
      name: formData.name || 'Новый шаблон',
      type: formData.type as RussianDocumentType || 'TORG12',
      format: formData.format as 'word' | 'excel' || 'excel',
      description: formData.description || '',
      dateCreated: selectedTemplate?.dateCreated || new Date().toISOString(),
      substitutionRules: formData.substitutionRules || '{}',
      file: templateFile
    };
    
    if (selectedTemplate) {
      // Update existing template
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? newTemplate : t));
      setIsEditDialogOpen(false);
      toast.success('Шаблон обновлен');
    } else {
      // Add new template
      setTemplates([...templates, newTemplate]);
      setIsUploadDialogOpen(false);
      toast.success('Шаблон добавлен');
    }
    
    // Reset form
    setSelectedTemplate(null);
    setFormData({
      name: '',
      type: 'TORG12',
      format: 'excel',
      description: '',
      substitutionRules: ''
    });
    setTemplateFile(null);
  };

  return {
    templates,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedTemplate,
    formData,
    setFormData,
    templateFile,
    setTemplateFile,
    handleUploadClick,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveTemplate
  };
};
