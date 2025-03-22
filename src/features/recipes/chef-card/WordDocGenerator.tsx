
import React from 'react';
import { toast } from "sonner";

interface WordDocGeneratorProps {
  processSteps: string[];
  recipeName?: string;
  preparationTime?: number;
  bakingTemperature?: number;
  formatPrepTime: (minutes: number) => string;
}

const WordDocGenerator: React.FC<WordDocGeneratorProps> = ({
  processSteps,
  recipeName,
  preparationTime,
  bakingTemperature,
  formatPrepTime
}) => {
  const handlePrintToWord = () => {
    try {
      // Generate Word-compatible HTML content with proper styling
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

  return { handlePrintToWord };
};

export default WordDocGenerator;
