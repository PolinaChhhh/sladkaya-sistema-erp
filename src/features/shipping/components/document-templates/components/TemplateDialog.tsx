
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { RussianDocumentType } from '@/store/types/shipping';
import { DocumentTemplate } from '../types';

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<DocumentTemplate>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<DocumentTemplate>>>;
  templateFile: File | null;
  setTemplateFile: React.Dispatch<React.SetStateAction<File | null>>;
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTemplateFile(file);
      
      // Update format based on file extension
      const format = file.name.endsWith('.docx') ? 'word' : 'excel';
      setFormData(prev => ({ ...prev, format }));
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактирование шаблона' : 'Загрузка шаблона документа'}</DialogTitle>
          {!isEdit && (
            <DialogDescription>
              Загрузите файл шаблона документа для автоматической генерации
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isEdit && (
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
          )}
          
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
          
          {isEdit && (
            <>
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
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? 'Сохранить изменения' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
