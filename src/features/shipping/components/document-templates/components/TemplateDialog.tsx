
import React, { useState } from 'react';
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
import { useRef } from 'react';
import { toast } from 'sonner';

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<DocumentTemplate, 'id' | 'dateCreated'> & { id?: string }) => void;
  editingTemplate: DocumentTemplate | null;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  editingTemplate
}) => {
  // Form state
  const [name, setName] = useState(editingTemplate?.name || '');
  const [type, setType] = useState<RussianDocumentType>(editingTemplate?.type || 'TORG12');
  const [format, setFormat] = useState<'word' | 'excel'>(editingTemplate?.format || 'word');
  const [description, setDescription] = useState(editingTemplate?.description || '');
  const [file, setFile] = useState<File | null>(editingTemplate?.file || null);
  const [substitutionRules, setSubstitutionRules] = useState(
    editingTemplate?.substitutionRules || JSON.stringify({ rules: [] }, null, 2)
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form when dialog opens with a template or closes
  React.useEffect(() => {
    if (isOpen && editingTemplate) {
      setName(editingTemplate.name);
      setType(editingTemplate.type);
      setFormat(editingTemplate.format);
      setDescription(editingTemplate.description);
      setFile(editingTemplate.file);
      setSubstitutionRules(editingTemplate.substitutionRules);
    } else if (!isOpen) {
      // Reset form when dialog closes
      setName('');
      setType('TORG12');
      setFormat('word');
      setDescription('');
      setFile(null);
      setSubstitutionRules(JSON.stringify({ rules: [] }, null, 2));
    }
  }, [isOpen, editingTemplate]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSave = () => {
    // Validate
    if (!name.trim()) {
      toast.error('Введите название шаблона');
      return;
    }
    
    if (!file) {
      toast.error('Загрузите файл шаблона');
      return;
    }
    
    try {
      // Validate JSON rules
      JSON.parse(substitutionRules);
      
      // Save template
      onSave({
        id: editingTemplate?.id,
        name,
        type,
        format,
        description,
        file,
        substitutionRules
      });
      
      onOpenChange(false);
    } catch (e) {
      toast.error('Ошибка в формате правил подстановки (JSON)');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'Редактирование шаблона' : 'Создание шаблона документа'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название шаблона</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Введите название шаблона"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип документа</label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as RussianDocumentType)}
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
                value={format} 
                onValueChange={(value) => setFormat(value as 'word' | 'excel')}
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
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
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
                {file ? 'Изменить файл' : 'Загрузить файл'}
              </Button>
              <input 
                type="file" 
                accept=".docx,.doc,.xlsx,.xls" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
            </div>
            {file && (
              <p className="text-xs text-green-600">
                Загружен файл: {file.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Правила подстановки (JSON)</label>
            <Textarea 
              value={substitutionRules} 
              onChange={(e) => setSubstitutionRules(e.target.value)} 
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
            {editingTemplate ? 'Сохранить изменения' : 'Создать шаблон'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
