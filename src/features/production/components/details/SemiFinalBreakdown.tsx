
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

  return (
    <div className="space-y-6">
      {semiFinalBreakdown.map((semi, index) => {
        const hasFifoDetails = semi.fifoDetails && semi.fifoDetails.length > 0;
        const isOpen = openItems[index] || false;
        
        return (
          <div key={index} className="glass rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={hasFifoDetails ? 3 : 4}>
                    <div className="flex items-center">
                      {hasFifoDetails && (
                        <button 
                          onClick={() => toggleItem(index)} 
                          className="mr-2 p-1 rounded-full hover:bg-gray-100"
                        >
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      )}
                      {semi.name} ({semi.quantity.toFixed(2)} {semi.unit})
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Ингредиент</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Стоимость за ед.</TableHead>
                  <TableHead>Общая стоимость</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semi.ingredients.map((ing, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{ing.name}</TableCell>
                    <TableCell>{ing.amount.toFixed(2)} {ing.unit}</TableCell>
                    <TableCell>{(ing.cost / ing.amount).toFixed(2)} ₽/{ing.unit}</TableCell>
                    <TableCell>{ing.cost.toFixed(2)} ₽</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-medium text-right">Итого:</TableCell>
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
