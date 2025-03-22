
import React from 'react';
import { toast } from "sonner";

interface WordDocGeneratorProps {
  processSteps: string[];
  recipeName?: string;
  preparationTime?: number;
  bakingTemperature?: number;
  formatPrepTime: (minutes: number) => string;
  ingredients?: Array<{name: string; amount: number; unit: string}>;
  output?: number;
  outputUnit?: string;
}

// Create a function that will handle the Word document generation
const generateWordDocument = (props: WordDocGeneratorProps) => {
  const {
    processSteps,
    recipeName,
    preparationTime,
    bakingTemperature,
    formatPrepTime,
    ingredients = [],
    output,
    outputUnit
  } = props;
  
  try {
    // Generate ingredients table HTML
    const ingredientsTableHtml = ingredients.length > 0 
      ? `
      <h2>ИНГРЕДИЕНТЫ:</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Наименование</th>
            <th>Количество</th>
            <th>Единица измерения</th>
          </tr>
        </thead>
        <tbody>
          ${ingredients.map(ing => `
            <tr>
              <td>${ing.name}</td>
              <td style="text-align: right;">${ing.amount}</td>
              <td>${ing.unit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` 
      : '';

    // Add output information
    const outputHtml = output 
      ? `<p class="info" style="font-weight: bold;">Выход продукта: ${output} ${outputUnit || ''}</p>`
      : '';
    
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
    table { width: 100%; margin: 15pt 0; border-collapse: collapse; }
    th { background-color: #f2f2f2; text-align: left; padding: 5pt; }
    td { padding: 5pt; }
  </style>
</head>
<body>
  <h1>ТЕХНОЛОГИЧЕСКАЯ КАРТА</h1>
  <h2>${recipeName || 'Рецепт'}</h2>
  
  ${outputHtml}
  ${preparationTime ? `<p class="info">Время отпекания: ${formatPrepTime(preparationTime)}</p>` : ''}
  ${bakingTemperature ? `<p class="info">Температура: ${bakingTemperature}°C</p>` : ''}
  
  ${ingredientsTableHtml}
  
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

// Export a hook-like function to use this functionality
export const useWordDocGenerator = (props: WordDocGeneratorProps) => {
  return { 
    handlePrintToWord: () => generateWordDocument(props)
  };
};

export default function WordDocGenerator() {
  // This is a utility component that doesn't render UI
  return null;
}
