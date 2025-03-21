
import React from 'react';
import { ArrowDown } from 'lucide-react';

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
  if (recipeCategory !== 'finished') return null;

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-2">Использованные полуфабрикаты</h3>
      
      {semiFinalsBreakdown.length === 0 ? (
        <p className="text-gray-500 italic">Нет использованных полуфабрикатов</p>
      ) : (
        <div className="space-y-2">
          {semiFinalsBreakdown.map((semiFinal, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-gray-500" />
                  <span>{getRecipeName(semiFinal.recipeId)}</span>
                </div>
                <div>
                  <span>{semiFinal.amount.toFixed(2)} ед.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemiFinalsSection;
