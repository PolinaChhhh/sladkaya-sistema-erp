
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';

interface FormatSelectorProps {
  documentFormat: 'pdf' | 'excel';
  setDocumentFormat: (format: 'pdf' | 'excel') => void;
  isGenerating: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  documentFormat,
  setDocumentFormat,
  isGenerating
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Формат документа</label>
      <Tabs 
        value={documentFormat} 
        onValueChange={(value) => setDocumentFormat(value as 'pdf' | 'excel')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="pdf" disabled={isGenerating}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="excel" disabled={isGenerating}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FormatSelector;
