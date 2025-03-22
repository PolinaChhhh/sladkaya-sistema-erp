
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileText, FileSpreadsheet, Edit, Trash, Download } from 'lucide-react';
import { DocumentTemplate } from '../types';
import { RussianDocumentType } from '@/store/types/shipping';

interface TemplateCardProps {
  template: DocumentTemplate;
  onEdit: (template: DocumentTemplate) => void;
  onDelete: (templateId: string) => void;
}

const documentTypeLabels: Record<RussianDocumentType, string> = {
  'TORG12': 'ТОРГ-12',
  'UTD': 'УПД',
  'TTN': 'ТТН',
  'TN': 'ТН'
};

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit, onDelete }) => {
  return (
    <Card>
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
          <Button size="sm" variant="outline" onClick={() => onEdit(template)}>
            <Edit className="h-4 w-4 mr-1" />
            Изменить
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(template.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" variant="ghost">
          <Download className="h-4 w-4 mr-1" />
          Скачать
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
