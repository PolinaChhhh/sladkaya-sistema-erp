
import React from 'react';
import { format } from 'date-fns';
import { Package } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IngredientUsageDetail } from '../../hooks/useProductionDetails';

interface IngredientsUsageSectionProps {
  ingredientUsageDetails: IngredientUsageDetail[];
}

const IngredientsUsageSection: React.FC<IngredientsUsageSectionProps> = ({ 
  ingredientUsageDetails 
}) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Неизвестная дата';
    }
  };

  const totalIngredientsCost = ingredientUsageDetails.reduce(
    (sum, detail) => sum + detail.totalCost, 
    0
  );

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-2">Расход ингредиентов</h3>
      
      {ingredientUsageDetails.length === 0 ? (
        <p className="text-gray-500 italic">Нет данных о расходе ингредиентов</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {ingredientUsageDetails.map((detail, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="py-3">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{detail.ingredientName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{detail.totalAmount.toFixed(2)} {detail.unit}</span>
                    <span className="font-medium">{detail.totalCost.toFixed(2)} ₽</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 space-y-2">
                  {detail.usageBreakdown.map((usage, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-gray-500">Приход от:</span>
                        <div>{formatDate(usage.receiptDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Количество:</span>
                        <div>{usage.amount.toFixed(2)} {detail.unit}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Стоимость:</span>
                        <div>{usage.totalCost.toFixed(2)} ₽ ({usage.unitPrice.toFixed(2)} ₽/{detail.unit})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      {/* Summary of costs - ingredients only */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">Стоимость ингредиентов:</span>
          <span>{totalIngredientsCost.toFixed(2)} ₽</span>
        </div>
      </div>
    </div>
  );
};

export default IngredientsUsageSection;
