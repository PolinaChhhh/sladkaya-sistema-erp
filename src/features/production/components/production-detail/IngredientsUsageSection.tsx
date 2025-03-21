
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IngredientUsageDetail {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  cost: number;
  fifoDetails: {
    receiptDate: string;
    amount: number;
    unitPrice: number;
    totalCost: number;
    reference?: string;
  }[];
}

interface IngredientsUsageSectionProps {
  ingredientUsageDetails: IngredientUsageDetail[];
}

const IngredientsUsageSection: React.FC<IngredientsUsageSectionProps> = ({
  ingredientUsageDetails
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (ingredientId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  const totalIngredientCost = ingredientUsageDetails.reduce(
    (total, item) => total + item.cost,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">Расход ингредиентов (метод FIFO)</h3>
        <span className="text-sm font-medium">
          Стоимость ингредиентов: {totalIngredientCost.toFixed(2)} ₽
        </span>
      </div>

      {ingredientUsageDetails.length === 0 ? (
        <p className="text-gray-500 italic">Нет использованных ингредиентов</p>
      ) : (
        <div className="space-y-2">
          {ingredientUsageDetails.map((usage) => {
            const isExpanded = expandedItems[usage.ingredientId] || false;
            const hasFifoDetails = usage.fifoDetails && usage.fifoDetails.length > 0;
            
            return (
              <div key={usage.ingredientId} className="border border-gray-200 rounded-md overflow-hidden">
                <div 
                  className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(usage.ingredientId)}
                >
                  <div>
                    <span className="font-medium">{usage.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{usage.amount.toFixed(2)} {usage.unit}</span>
                    <span>{usage.cost.toFixed(2)} ₽</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 bg-white">
                    <div className="text-xs text-gray-500 mb-2">
                      Расход по партиям (FIFO):
                    </div>
                    <div className="space-y-2">
                      {hasFifoDetails ? (
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="text-xs text-gray-500">
                              <th className="text-left pb-1">Дата поступления</th>
                              <th className="text-right pb-1">№ документа</th>
                              <th className="text-right pb-1">Количество</th>
                              <th className="text-right pb-1">Цена закупки</th>
                              <th className="text-right pb-1">Стоимость</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usage.fifoDetails.map((detail, idx) => (
                              <tr key={idx} className="border-b last:border-b-0">
                                <td className="py-1 text-left">
                                  {new Date(detail.receiptDate).toLocaleDateString()}
                                </td>
                                <td className="py-1 text-right text-gray-600">
                                  {detail.reference || '—'}
                                </td>
                                <td className="py-1 text-right">
                                  {detail.amount.toFixed(2)} {usage.unit}
                                </td>
                                <td className="py-1 text-right">
                                  {detail.unitPrice.toFixed(2)} ₽/{usage.unit}
                                </td>
                                <td className="py-1 text-right font-medium">
                                  {detail.totalCost.toFixed(2)} ₽
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t">
                              <td colSpan={4} className="pt-1 text-right font-medium">
                                Итого:
                              </td>
                              <td className="pt-1 text-right font-bold">
                                {usage.cost.toFixed(2)} ₽
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      ) : (
                        <p className="text-gray-500 italic text-sm">
                          Нет данных о закупках для этого ингредиента
                        </p>
                      )}
                    </div>
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

export default IngredientsUsageSection;
