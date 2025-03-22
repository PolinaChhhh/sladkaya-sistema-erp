
import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProcessHeaderProps {
  onDownload: () => void;
}

const ProcessHeader: React.FC<ProcessHeaderProps> = ({ onDownload }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-medium flex items-center gap-2 text-confection-700">
        <Clock className="h-5 w-5 text-mint-600" />
        Технологический процесс
      </h2>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={onDownload}
            >
              <FileText className="h-4 w-4" />
              <span className="whitespace-nowrap">Скачать тех.карту</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Скачать технологическую карту в формате Word</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProcessHeader;
