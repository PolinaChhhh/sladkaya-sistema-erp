
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RussianDocumentType } from '@/store/types/shipping';
import { Upload, FileText, FileSpreadsheet, Edit, Trash, Download, Save } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: RussianDocumentType;
  format: 'word' | 'excel';
  description: string;
  dateCreated: string;
  substitutionRules: string; // JSON string with rules for data substitution
  file: File | null;
}

const DocumentTemplatesList = () => {
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTemplateFile(file);
      
      // Update format based on file extension
      const format = file.name.endsWith('.docx') ? 'word' : 'excel';
      setFormData(prev => ({ ...prev, format }));
    }
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
  
  const documentTypeLabels: Record<RussianDocumentType, string> = {
    'TORG12': 'ТОРГ-12',
    'UTD': 'УПД',
    'TTN': 'ТТН',
    'TN': 'ТН'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Шаблоны документов</h2>
        <Button onClick={handleUploadClick}>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить шаблон
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <p className="text-gray-500">Шаблоны документов не найдены</p>
            <Button onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить шаблон
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {template.format === 'word' ? (
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 mr-2 text-green-500" />
                  )}
                  {template.name}
                </CardTitle>
                <CardDescription>
                  {documentTypeLabels[template.type]} • {template.format === 'word' ? 'Word' : 'Excel'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{template.description || 'Нет описания'}</p>
                {template.substitutionRules && template.substitutionRules !== '{}' && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700">Правила подстановки:</p>
                    <p className="text-xs truncate text-gray-500">
                      {JSON.parse(template.substitutionRules).length || 0} правил настроено
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4 mr-1" />
                  Скачать
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Upload Template Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Загрузка шаблона документа</DialogTitle>
            <DialogDescription>
              Загрузите файл шаблона документа для автоматической генерации
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateFile">Файл шаблона</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="templateFile"
                  type="file"
                  onChange={handleFileChange}
                  accept=".docx,.xls,.xlsx"
                />
              </div>
              {templateFile && (
                <p className="text-xs text-green-600">
                  Выбран файл: {templateFile.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateName">Название шаблона</Label>
              <Input
                id="templateName"
                placeholder="Например: ТОРГ-12 для ООО Фирма"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateType">Тип документа</Label>
              <select
                id="templateType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RussianDocumentType })}
              >
                <option value="TORG12">ТОРГ-12</option>
                <option value="UTD">УПД</option>
                <option value="TTN">ТТН</option>
                <option value="TN">ТН</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Описание (опционально)</Label>
              <Textarea
                id="templateDescription"
                placeholder="Описание шаблона"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактирование шаблона</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTemplateName">Название шаблона</Label>
              <Input
                id="editTemplateName"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editTemplateType">Тип документа</Label>
              <select
                id="editTemplateType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RussianDocumentType })}
              >
                <option value="TORG12">ТОРГ-12</option>
                <option value="UTD">УПД</option>
                <option value="TTN">ТТН</option>
                <option value="TN">ТН</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editTemplateDescription">Описание</Label>
              <Textarea
                id="editTemplateDescription"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editTemplateFile">Файл шаблона</Label>
              <Input
                id="editTemplateFile"
                type="file"
                onChange={handleFileChange}
                accept=".docx,.xls,.xlsx"
              />
              {templateFile && (
                <p className="text-xs text-green-600">
                  Текущий файл: {templateFile.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="substitutionRules">Правила подстановки данных</Label>
              <Textarea
                id="substitutionRules"
                placeholder="Укажите переменные для подстановки данных, например: {{shipping.customer}} - имя клиента"
                value={formData.substitutionRules || ''}
                onChange={(e) => setFormData({ ...formData, substitutionRules: e.target.value })}
                className="font-mono text-sm"
                rows={8}
              />
              <p className="text-xs text-gray-500">
                Укажите правила подстановки данных из отгрузки в шаблон. Например:<br />
                <code>{{shipping.date}}</code> - дата отгрузки<br />
                <code>{{buyer.name}}</code> - название компании покупателя<br />
                <code>{{items[0].productName}}</code> - название первого товара
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTemplatesList;
