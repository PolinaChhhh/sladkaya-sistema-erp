
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EmptyReportStateProps {
  message?: string;
}

const EmptyReportState: React.FC<EmptyReportStateProps> = ({ 
  message = "Нет данных для отображения" 
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="bg-muted/50 p-4 rounded-full">
        <BarChart3 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Данные отсутствуют</h3>
      <p className="text-muted-foreground max-w-md">
        {message}
      </p>
    </div>
  );
};

export default EmptyReportState;
