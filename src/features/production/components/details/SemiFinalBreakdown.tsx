
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SemiFinalBreakdown as SemiFinalBreakdownType } from '../../utils/fifo';

interface SemiFinalBreakdownProps {
  semiFinalBreakdown: SemiFinalBreakdownType[];
}

const SemiFinalBreakdown: React.FC<SemiFinalBreakdownProps> = ({ semiFinalBreakdown }) => {
  const [openItems, setOpenItems] = React.useState<Record<number, boolean>>({});
  const [openIngredients, setOpenIngredients] = React.useState<Record<string, boolean>>({});

  if (semiFinalBreakdown.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет данных о полуфабрикатах
      </div>
    );
  }

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleIngredient = (semiFinalIndex: number, ingredientIndex: number) => {
    const key = `${semiFinalIndex}-${ingredientIndex}`;
    setOpenIngredients(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {semiFinalBreakdown.map((semi, index) => {
        const hasFifoDetails = semi.fifoDetails && semi.fifoDetails.length > 0;
        const isOpen = openItems[index] || false;
        
        return (
          <div key={index} className="glass rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {hasFifoDetails && (
                    <button 
                      onClick={() => toggleItem(index)} 
                      className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                  )}
                  <h3 className="text-lg font-medium">{semi.name} ({semi.quantity.toFixed(2)} {semi.unit})</h3>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Общая стоимость:</span>
                  <p className="font-medium">{semi.cost.toFixed(2)} ₽</p>
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Ингредиент</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Стоимость за ед.</TableHead>
                  <TableHead>Общая стоимость</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semi.ingredients.map((ing, idx) => {
                  const ingredientKey = `${index}-${idx}`;
                  const isIngredientOpen = openIngredients[ingredientKey] || false;
                  const hasIngredientFifo = ing.fifoDetails && ing.fifoDetails.length > 0;
                  
                  return (
                    <React.Fragment key={idx}>
                      <TableRow>
                        <TableCell>
                          {hasIngredientFifo && (
                            <button
                              onClick={() => toggleIngredient(index, idx)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              {isIngredientOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>{ing.name}</TableCell>
                        <TableCell>{ing.amount.toFixed(2)} {ing.unit}</TableCell>
                        <TableCell>{(ing.cost / ing.amount).toFixed(2)} ₽/{ing.unit}</TableCell>
                        <TableCell>{ing.cost.toFixed(2)} ₽</TableCell>
                      </TableRow>
                      {hasIngredientFifo && isIngredientOpen && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50 p-0">
                            <div className="p-3">
                              <h4 className="text-xs font-medium mb-2 text-gray-500">Расход по партиям (FIFO):</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Номер поступления</TableHead>
                                    <TableHead>Дата</TableHead>
                                    <TableHead>Количество</TableHead>
                                    <TableHead>Цена за ед.</TableHead>
                                    <TableHead>Сумма</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {ing.fifoDetails?.map((detail, fidx) => (
                                    <TableRow key={fidx}>
                                      <TableCell>{detail.referenceNumber || 'Б/Н'}</TableCell>
                                      <TableCell>{format(new Date(detail.date), 'dd.MM.yyyy')}</TableCell>
                                      <TableCell>{detail.quantity.toFixed(2)} {ing.unit}</TableCell>
                                      <TableCell>{detail.unitPrice.toFixed(2)} ₽</TableCell>
                                      <TableCell>{detail.totalPrice.toFixed(2)} ₽</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} className="font-medium text-right">Итого:</TableCell>
                  <TableCell className="font-medium">{semi.cost.toFixed(2)} ₽</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            {hasFifoDetails && (
              <Collapsible open={isOpen}>
                <CollapsibleContent>
                  <div className="p-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Расход по партиям (FIFO):</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Количество</TableHead>
                          <TableHead>Цена за ед.</TableHead>
                          <TableHead>Сумма</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semi.fifoDetails?.map((detail, fidx) => (
                          <TableRow key={fidx}>
                            <TableCell>{format(new Date(detail.date), 'dd.MM.yyyy')}</TableCell>
                            <TableCell>{detail.quantity.toFixed(2)} {semi.unit}</TableCell>
                            <TableCell>{detail.unitCost.toFixed(2)} ₽</TableCell>
                            <TableCell>{detail.totalCost.toFixed(2)} ₽</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SemiFinalBreakdown;
