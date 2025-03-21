
import React from 'react';
import { Clock, ArrowRight, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecipeProcessProps {
  processSteps: string[];
  preparationTime?: number;
  category: 'finished' | 'semi-finished';
  bakingTemperature?: number;
}

const RecipeProcess: React.FC<RecipeProcessProps> = ({ 
  processSteps, 
  preparationTime, 
  category,
  bakingTemperature
}) => {
  const highlightProcessText = (text: string) => {
    const keyWords = ['mix', 'bake', 'cool', 'stir', 'whisk', 'fold', 'knead', 'melt', 'sift', 'beat', 'chill', 'boil', 'simmer', 'roast', 'fry'];
    
    return keyWords.reduce((result, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return result.replace(regex, `<span class="text-confection-500 font-medium">${word}</span>`);
    }, text);
  };
  
  // Format preparation time from minutes to hours and minutes if needed
  const formatPrepTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} мин`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours} ч`;
    return `${hours} ч ${remainingMinutes} мин`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium flex items-center gap-2 text-confection-700">
          <Clock className="h-5 w-5 text-mint-600" />
          Технологический процесс
        </h2>
      </div>
      
      <div className="bg-white border border-cream-100 rounded-xl p-5 mb-6 shadow-sm">
        {processSteps.length > 0 ? (
          <ol className="space-y-4">
            {processSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cream-100 text-confection-600 flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </div>
                <div 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightProcessText(step) 
                  }}
                />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-400 italic text-center py-6">
            Технологический процесс не описан
          </p>
        )}
        
        {category === 'semi-finished' && (
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
        )}
      </div>
      
      <div className="text-right">
        <Button 
          className="bg-confection-600 hover:bg-confection-700 text-white"
        >
          Добавить в производство
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeProcess;
