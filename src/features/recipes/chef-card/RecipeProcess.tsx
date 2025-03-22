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
      // Generate recipe content as HTML for Word compatibility
      const recipeContent = generateRecipeContent();
      
      // Create Word-compatible HTML content with proper styling
      const wordHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Технологическая карта</title>
  <style>
    body { font-family: 'Arial', sans-serif; margin: 2cm; }
    h1 { text-align: center; font-size: 16pt; }
    h2 { font-size: 14pt; margin-top: 20pt; }
    .info { margin: 10pt 0; }
    ol { margin-left: 0; padding-left: 20pt; }
    li { margin-bottom: 10pt; }
  </style>
</head>
<body>
  <h1>ТЕХНОЛОГИЧЕСКАЯ КАРТА</h1>
  <h2>${recipeName || 'Рецепт'}</h2>
  
  ${preparationTime ? `<p class="info">Время подготовки: ${formatPrepTime(preparationTime)}</p>` : ''}
  ${bakingTemperature ? `<p class="info">Температура: ${bakingTemperature}°C</p>` : ''}
  
  <h2>ТЕХНОЛОГИЧЕСКИЙ ПРОЦЕСС:</h2>
  <ol>
    ${processSteps.map(step => `<li>${step}</li>`).join('\n    ')}
  </ol>
</body>
</html>
      `;
      
      // Convert to Blob with correct MIME type for Word
      const blob = new Blob([wordHtml], { 
        type: 'application/vnd.ms-word' 
      });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Тех_карта_${recipeName || 'рецепт'}.doc`;
      
      // Show preparing toast
      toast.success("Подготовка документа Word...", {
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
          description: "Технологическая карта сохранена в формате Word.",
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
    return processSteps.join('\n');
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
              <p>Скачать технологическую карту в формате Word</p>
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
