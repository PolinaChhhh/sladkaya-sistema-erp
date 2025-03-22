
import React from 'react';
import { Clock, Thermometer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner";

interface RecipeProcessProps {
  processSteps: string[];
  preparationTime?: number;
  category: 'finished' | 'semi-finished';
  bakingTemperature?: number;
  recipeName?: string;
}

const RecipeProcess: React.FC<RecipeProcessProps> = ({ 
  processSteps, 
  preparationTime, 
  category,
  bakingTemperature,
  recipeName
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

  const handlePrintToWord = () => {
    try {
      // Generate recipe content as plain text
      const recipeContent = generateRecipeContent();
      
      // Create a simple text blob instead of trying to create a Word document
      const blob = new Blob([recipeContent], { type: 'text/plain' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Тех_карта_${recipeName || 'рецепт'}.txt`;
      
      // Show preparing toast
      toast.success("Подготовка документа...", {
        description: `Файл будет скачан через несколько секунд.`,
      });
      
      // Trigger download after small delay for better UX
      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Revoke object URL to free memory
        URL.revokeObjectURL(url);
        
        toast.success("Документ успешно создан!", {
          description: "Технологическая карта сохранена в текстовом формате.",
        });
      }, 800);
    } catch (error) {
      console.error("Ошибка при создании документа:", error);
      toast.error("Ошибка при создании документа", {
        description: "Попробуйте еще раз или обратитесь в поддержку.",
      });
    }
  };
  
  const generateRecipeContent = (): string => {
    // Simple text format for the recipe content
    let content = '';
    
    // Add recipe name as title
    content += `ТЕХНОЛОГИЧЕСКАЯ КАРТА\r\n\r\n`;
    content += `${recipeName || 'Рецепт'}\r\n\r\n`;
    
    // Add preparation info if available
    if (preparationTime) {
      content += `Время подготовки: ${formatPrepTime(preparationTime)}\r\n`;
    }
    
    if (bakingTemperature) {
      content += `Температура: ${bakingTemperature}°C\r\n`;
    }
    
    content += `\r\nТЕХНОЛОГИЧЕСКИЙ ПРОЦЕСС:\r\n\r\n`;
    
    // Add process steps
    processSteps.forEach((step, index) => {
      content += `${index + 1}. ${step}\r\n`;
    });
    
    return content;
  };
  
  return (
    <div>
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
                onClick={handlePrintToWord}
              >
                <FileText className="h-4 w-4" />
                <span className="whitespace-nowrap">Скачать тех.карту</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Скачать технологическую карту в текстовом формате</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
    </div>
  );
};

export default RecipeProcess;
