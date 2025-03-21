import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import FifoDetailsTable from './FifoDetailsTable';
import { IngredientUsage } from '../../utils/fifo/types';

interface IngredientUsageItemProps {
  usage: IngredientUsage;
  isOpen: boolean;
  onToggle: () => void;
}

const IngredientUsageItem: React.FC<IngredientUsageItemProps> = ({ 
  usage, 
  isOpen, 
  onToggle 
}) => {
  const hasFifoDetails = usage.fifoDetails && usage.fifoDetails.length > 0;
  
  return (
    <div className="glass rounded-md overflow-hidden">
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
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
            <FifoDetailsTable 
              fifoDetails={usage.fifoDetails} 
              unit={usage.unit} 
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default IngredientUsageItem;
