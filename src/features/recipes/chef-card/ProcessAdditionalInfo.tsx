
import React from 'react';
import { Clock, Thermometer } from 'lucide-react';

interface ProcessAdditionalInfoProps {
  preparationTime?: number;
  bakingTemperature?: number;
  formatPrepTime: (minutes: number) => string;
}

const ProcessAdditionalInfo: React.FC<ProcessAdditionalInfoProps> = ({
  preparationTime,
  bakingTemperature,
  formatPrepTime
}) => {
  if (!preparationTime && !bakingTemperature) return null;
  
  return (
    <div className="mt-6 pt-4 border-t border-cream-100">
      <div className="grid grid-cols-2 gap-4">
        {preparationTime && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="p-1.5 rounded-full bg-mint-100">
              <Clock className="h-4 w-4 text-mint-600" />
            </div>
            <div>
              <div className="font-medium">Время отпекания</div>
              <div>{formatPrepTime(preparationTime)}</div>
            </div>
          </div>
        )}
        
        {bakingTemperature && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="p-1.5 rounded-full bg-amber-100">
              <Thermometer className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium">Температура</div>
              <div>{bakingTemperature}°C</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessAdditionalInfo;
