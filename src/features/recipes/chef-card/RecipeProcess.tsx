
import React from 'react';
import ProcessHeader from './ProcessHeader';
import ProcessStepsList from './ProcessStepsList';
import ProcessAdditionalInfo from './ProcessAdditionalInfo';
import WordDocGenerator from './WordDocGenerator';
import { useProcessUtils } from './useProcessUtils';

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
  // Get utility functions
  const { formatPrepTime, highlightProcessText } = useProcessUtils();
  
  // Initialize the Word document generator
  const { handlePrintToWord } = WordDocGenerator({
    processSteps,
    recipeName,
    preparationTime,
    bakingTemperature,
    formatPrepTime
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
