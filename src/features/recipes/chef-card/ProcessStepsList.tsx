
import React from 'react';

interface ProcessStepsListProps {
  processSteps: string[];
  highlightProcessText: (text: string) => string;
}

const ProcessStepsList: React.FC<ProcessStepsListProps> = ({ 
  processSteps,
  highlightProcessText
}) => {
  return (
    <>
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
    </>
  );
};

export default ProcessStepsList;
