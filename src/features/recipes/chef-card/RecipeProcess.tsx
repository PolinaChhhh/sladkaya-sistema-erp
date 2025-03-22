
import React from 'react';
import ProcessHeader from './ProcessHeader';
import ProcessStepsList from './ProcessStepsList';
import ProcessAdditionalInfo from './ProcessAdditionalInfo';
import { useWordDocGenerator } from './WordDocGenerator';
import { useProcessUtils } from './useProcessUtils';

interface RecipeProcessProps {
  processSteps: string[];
  preparationTime?: number;
  category: 'finished' | 'semi-finished';
  bakingTemperature?: number;
  recipeName?: string;
  items?: Array<{
    type?: 'ingredient' | 'recipe';
    ingredientId?: string;
    recipeId?: string;
    amount: number;
  }>;
  output?: number;
  outputUnit?: string;
  getIngredientName?: (id: string) => string;
  getIngredientUnit?: (id: string) => string;
  getRecipeName?: (id: string) => string;
  getRecipeUnit?: (id: string) => string;
}

const RecipeProcess: React.FC<RecipeProcessProps> = ({ 
  processSteps = [], 
  preparationTime, 
  category,
  bakingTemperature,
  recipeName,
  items = [],
  output,
  outputUnit,
  getIngredientName = () => 'Неизвестный ингредиент',
  getIngredientUnit = () => '',
  getRecipeName = () => 'Неизвестный рецепт',
  getRecipeUnit = () => ''
}) => {
  // Get utility functions
  const { formatPrepTime, highlightProcessText } = useProcessUtils();
  
  // Prepare ingredients data for the Word document
  const ingredients = items.map(item => {
    if (item.type === 'ingredient' && item.ingredientId) {
      return {
        name: getIngredientName(item.ingredientId),
        amount: item.amount,
        unit: getIngredientUnit(item.ingredientId)
      };
    } else if (item.type === 'recipe' && item.recipeId) {
      return {
        name: getRecipeName(item.recipeId),
        amount: item.amount,
        unit: getRecipeUnit(item.recipeId)
      };
    }
    return { name: 'Неизвестный', amount: item.amount, unit: '' };
  });
  
  // Initialize the Word document generator
  const { handlePrintToWord } = useWordDocGenerator({
    processSteps,
    recipeName,
    preparationTime,
    bakingTemperature,
    formatPrepTime,
    ingredients,
    output,
    outputUnit
  });
  
  return (
    <div>
      {/* Header with download button */}
      <ProcessHeader onDownload={handlePrintToWord} />
      
      {/* Main content container */}
      <div className="bg-white border border-cream-100 rounded-xl p-5 mb-6 shadow-sm">
        {/* Process steps list */}
        <ProcessStepsList 
          processSteps={processSteps} 
          highlightProcessText={highlightProcessText} 
        />
        
        {/* Additional info for semi-finished recipes */}
        {category === 'semi-finished' && (
          <ProcessAdditionalInfo
            preparationTime={preparationTime}
            bakingTemperature={bakingTemperature}
            formatPrepTime={formatPrepTime}
          />
        )}
      </div>
    </div>
  );
};

export default RecipeProcess;
