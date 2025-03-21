
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeProcessProps {
  processSteps: string[];
}

const RecipeProcess: React.FC<RecipeProcessProps> = ({ processSteps }) => {
  const highlightProcessText = (text: string) => {
    const keyWords = ['mix', 'bake', 'cool', 'stir', 'whisk', 'fold', 'knead', 'melt', 'sift', 'beat', 'chill', 'boil', 'simmer', 'roast', 'fry'];
    
    return keyWords.reduce((result, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return result.replace(regex, `<span class="text-confection-600 font-medium">${word}</span>`);
    }, text);
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium flex items-center gap-2 mb-3 text-gray-800">
        <Clock className="h-5 w-5 text-confection-500" />
        Технологический процесс
      </h2>
      
      <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6 shadow-sm">
        {processSteps.length > 0 ? (
          <ol className="space-y-4">
            {processSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-confection-100 text-confection-600 flex items-center justify-center font-medium text-sm">
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
      </div>
      
      <div className="text-right">
        <Button 
          className="bg-confection-600 hover:bg-confection-700"
        >
          Добавить в производство
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeProcess;
