
import React, { useState } from 'react';
import { ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';

interface SemiFinalsBreakdown {
  recipeId: string;
  amount: number;
  cost: number;
}

interface SemiFinalsSectionProps {
  semiFinalsBreakdown: SemiFinalsBreakdown[];
  getRecipeName: (recipeId: string) => string;
  recipeCategory: string;
}

const SemiFinalsSection: React.FC<SemiFinalsSectionProps> = ({ 
  semiFinalsBreakdown, 
  getRecipeName, 
  recipeCategory 
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (recipeCategory !== 'finished') return null;

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-2">Использованные полуфабрикаты</h3>
      
      {semiFinalsBreakdown.length === 0 ? (
        <p className="text-gray-500 italic">Нет использованных полуфабрикатов</p>
      ) : (
        <div className="space-y-2">
          {semiFinalsBreakdown.map((semiFinal, index) => {
            const isExpanded = expandedItems[index] || false;
            
            return (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                <div 
                  className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-gray-500" />
                    <span>{getRecipeName(semiFinal.recipeId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{semiFinal.amount.toFixed(2)} ед.</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700">
                      Здесь будет детализация использования полуфабриката
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SemiFinalsSection;
