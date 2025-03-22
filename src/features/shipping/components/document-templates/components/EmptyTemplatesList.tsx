
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface EmptyTemplatesListProps {
  onUploadClick: () => void;
}

const EmptyTemplatesList: React.FC<EmptyTemplatesListProps> = ({ onUploadClick }) => {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <p className="text-gray-500">Шаблоны документов не найдены</p>
        <Button onClick={onUploadClick}>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить шаблон
        </Button>
      </div>
    </Card>
  );
};

export default EmptyTemplatesList;
