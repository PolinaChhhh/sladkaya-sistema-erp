
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, FileSpreadsheet } from 'lucide-react';

interface DocumentGenerationButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  documentFormat: 'word' | 'excel';
}

const DocumentGenerationButton: React.FC<DocumentGenerationButtonProps> = ({
  onClick,
  isGenerating,
  canGenerate,
  documentFormat
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={!canGenerate || isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Создание...
        </>
      ) : (
        <>
          {documentFormat === 'word' ? (
            <FileText className="h-4 w-4 mr-2" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          )}
          Создать и скачать
        </>
      )}
    </Button>
  );
};

export default DocumentGenerationButton;
