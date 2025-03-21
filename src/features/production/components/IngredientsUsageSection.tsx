
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FifoDetail {
  receiptId: string;
  referenceNumber?: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface IngredientUsage {
  ingredientId: string;
  name: string;
  totalAmount: number;
  unit: string;
  totalCost: number;
  fifoDetails: FifoDetail[];
}

interface IngredientsUsageSectionProps {
  usageDetails: IngredientUsage[];
}

const IngredientsUsageSection: React.FC<IngredientsUsageSectionProps> = ({ usageDetails }) => {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <div className="space-y-6">
      {usageDetails.map((usage, index) => {
        const isOpen = openItems[usage.ingredientId] || false;
        const hasFifoDetails = usage.fifoDetails && usage.fifoDetails.length > 0;
        
        return (
          <div key={index} className="glass rounded-md overflow-hidden">
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleItem(usage.ingredientId)}
            >
              <CollapsibleTrigger className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Ингредиент</TableHead>
                      <TableHead>Количество</TableHead>
                      <TableHead>Общая стоимость</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {hasFifoDetails ? (
                          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        ) : (
                          <span></span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{usage.name}</TableCell>
                      <TableCell>{usage.totalAmount.toFixed(2)} {usage.unit}</TableCell>
                      <TableCell>{usage.totalCost.toFixed(2)} ₽</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Расход по партиям (FIFO):</h4>
                  {hasFifoDetails ? (
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
                        {usage.fifoDetails.map((detail, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{detail.referenceNumber || 'Б/Н'}</TableCell>
                            <TableCell>{format(new Date(detail.date), 'dd.MM.yyyy')}</TableCell>
                            <TableCell>{detail.quantity.toFixed(2)} {usage.unit}</TableCell>
                            <TableCell>{detail.unitPrice.toFixed(2)} ₽</TableCell>
                            <TableCell>{detail.totalPrice.toFixed(2)} ₽</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-500">Нет данных о закупках для этого ингредиента</p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
      
      {usageDetails.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Нет данных об использованных ингредиентах
        </div>
      )}
    </div>
  );
};

export default IngredientsUsageSection;
