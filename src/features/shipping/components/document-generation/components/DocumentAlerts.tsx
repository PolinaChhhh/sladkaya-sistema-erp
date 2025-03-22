
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RussianDocumentType } from '@/store/types/shipping';

interface DocumentAlertsProps {
  documentType: RussianDocumentType;
  templateFile: File | null;
  canGenerate: boolean;
}

const DocumentAlerts: React.FC<DocumentAlertsProps> = ({
  documentType,
  templateFile,
  canGenerate
}) => {
  return (
    <>
      {documentType === 'TORG12' && !templateFile && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-xs text-amber-800">
            Для формы ТОРГ-12 рекомендуется загрузить шаблон документа для корректного формирования.
          </AlertDescription>
        </Alert>
      )}
      
      {!canGenerate && (
        <div className="text-sm p-3 bg-amber-50 text-amber-800 rounded-md">
          Для создания документа необходимы данные клиента и товары
        </div>
      )}
    </>
  );
};

export default DocumentAlerts;
