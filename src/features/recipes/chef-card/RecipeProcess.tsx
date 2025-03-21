
import React from 'react';
import { Clock, ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface RecipeProcessProps {
  processSteps: string[];
  preparationTime?: number;
}

const RecipeProcess: React.FC<RecipeProcessProps> = ({ processSteps, preparationTime }) => {
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
        
        {preparationTime && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-cream-50 px-3 py-1 rounded-full">
                  <Timer className="h-4 w-4 text-mint-600" />
                  <span>{formatPrepTime(preparationTime)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Время приготовления</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
        
        {preparationTime && processSteps.length > 0 && (
          <div className="mt-6 pt-4 border-t border-cream-100">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>Прогресс выполнения</span>
              <span>100%</span>
            </div>
            <Progress className="h-2 bg-cream-100" value={100} indicatorClassName="bg-mint-500" />
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
