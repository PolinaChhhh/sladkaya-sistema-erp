
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RussianDocumentType } from '@/store/types/shipping';

interface DocumentAlertsProps {
  documentType: RussianDocumentType;
  canGenerate: boolean;
}

const DocumentAlerts: React.FC<DocumentAlertsProps> = ({
  documentType,
  canGenerate
}) => {
  return (
    <>
      {!canGenerate && (
        <div className="text-sm p-3 bg-amber-50 text-amber-800 rounded-md">
          Для создания документа необходимы данные клиента и товары
        </div>
      )}
    </>
  );
};

export default DocumentAlerts;
