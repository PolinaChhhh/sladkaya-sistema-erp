
import React from 'react';
import { Scale, PercentCircle } from 'lucide-react';

interface RecipeOutputProps {
  output: number;
  outputUnit: string;
  lossPercentage?: number;
}

const RecipeOutput: React.FC<RecipeOutputProps> = ({ output, outputUnit, lossPercentage }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-gray-800">
        <Scale className="h-5 w-5 text-confection-500" />
        Выход продукта
      </h2>
      <div className="bg-cream-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Количество:</span>
          <span className="font-medium">{output} {outputUnit}</span>
        </div>
        
        {lossPercentage && lossPercentage > 0 && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 flex items-center">
              <PercentCircle className="h-4 w-4 text-amber-500 mr-1" /> 
              Потери:
            </span>
            <span className="font-medium">{lossPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeOutput;
