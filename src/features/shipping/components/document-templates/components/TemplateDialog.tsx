
import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RussianDocumentType } from '@/store/types/shipping';
import { DocumentTemplate } from '../types';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTemplateFile(e.target.files[0]);
    }
  };
  
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактирование шаблона' : 'Создание шаблона документа'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название шаблона</label>
            <Input 
              value={formData.name || ''} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Введите название шаблона"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип документа</label>
              <Select 
                value={formData.type as string || 'TORG12'} 
                onValueChange={(value) => setFormData({...formData, type: value as RussianDocumentType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TORG12">ТОРГ-12</SelectItem>
                  <SelectItem value="UTD">УПД</SelectItem>
                  <SelectItem value="TTN">ТТН</SelectItem>
                  <SelectItem value="TN">ТН</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Формат документа</label>
              <Select 
                value={formData.format || 'word'} 
                onValueChange={(value) => setFormData({...formData, format: value as 'word' | 'excel'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите формат" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea 
              value={formData.description || ''} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              placeholder="Краткое описание шаблона"
              rows={2}
            />
          </div>
          
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Правила подстановки (JSON)</label>
            <Textarea 
              value={formData.substitutionRules || '{"rules": []}'}
              onChange={(e) => setFormData({...formData, substitutionRules: e.target.value})} 
              placeholder='{"rules": []}'
              rows={4}
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500">
              Задает правила подстановки данных в шаблон документа в формате JSON
            </p>
          </div>
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
