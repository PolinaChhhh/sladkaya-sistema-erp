
import React from 'react';
import { Scale, PercentCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RecipeOutputProps {
  output: number;
  outputUnit: string;
  lossPercentage?: number;
}

const RecipeOutput: React.FC<RecipeOutputProps> = ({ output, outputUnit, lossPercentage }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-rose-700">
        <Scale className="h-5 w-5 text-mint-600" />
        Выход продукта
      </h2>
      <div className="bg-white border border-cream-100 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Количество:</span>
          <span className="font-medium">{output} {outputUnit}</span>
        </div>
        
        {lossPercentage && lossPercentage > 0 && (
          <>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-600 flex items-center">
                <PercentCircle className="h-4 w-4 text-mint-600 mr-1" /> 
                Потери:
              </span>
              <span className="font-medium">{lossPercentage}%</span>
            </div>
            <div className="mt-2">
              <Progress 
                className="h-2 bg-cream-100" 
                value={100 - lossPercentage} 
                indicatorClassName="bg-mint-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeOutput;
