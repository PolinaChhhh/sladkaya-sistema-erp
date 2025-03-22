
import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  HistoryIcon,
  PackageIcon,
  TruckIcon,
  ArrowDownIcon,
  ArrowUpIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductionBatch, Recipe, ShippingDocument } from '@/store/types';

interface ProductMovementHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  productions: ProductionBatch[];
  shippings: ShippingDocument[];
  getRecipeUnit: (id: string) => string;
}

interface MovementEvent {
  date: string;
  type: 'production' | 'shipment';
  quantity: number;
  unitValue: number; // cost for production, price for shipment
  reference: string;
  batchId?: string;
}

const ProductMovementHistory: React.FC<ProductMovementHistoryProps> = ({
  isOpen,
  onClose,
  recipe,
  productions,
  shippings,
  getRecipeUnit
}) => {
  const [dateFilter, setDateFilter] = useState('');
  
  const movementHistory = useMemo(() => {
    if (!recipe) return [];
    
    const events: MovementEvent[] = [];
    
    // Add production events
    const recipeProductions = productions
      .filter(p => p.recipeId === recipe.id)
      .map(prod => ({
        date: prod.date,
        type: 'production' as const,
        quantity: prod.quantity,
        unitValue: prod.quantity > 0 ? prod.cost / prod.quantity : 0,
        reference: `Производство ID: ${prod.id.substring(0, 8)}`,
        batchId: prod.id
      }));
    
    events.push(...recipeProductions);
    
    // Add shipment events
    shippings.forEach(shipping => {
      shipping.items.forEach(item => {
        // Find the production batch to check if it's for this recipe
        const relatedProduction = productions.find(p => p.id === item.productionBatchId);
        
        if (relatedProduction && relatedProduction.recipeId === recipe.id) {
          events.push({
            date: shipping.date,
            type: 'shipment',
            quantity: -item.quantity, // Negative to indicate reduction
            unitValue: item.price,
            reference: `Отгрузка №${shipping.shipmentNumber}`,
            batchId: item.productionBatchId
          });
        }
      });
    });
    
    // Sort by date, most recent first
    return events
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(event => {
        // Apply date filter if present
        if (!dateFilter) return true;
        
        const eventDate = new Date(event.date);
        return format(eventDate, 'yyyy-MM-dd').includes(dateFilter);
      });
  }, [recipe, productions, shippings, dateFilter]);
  
  if (!recipe) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            История движения продукта: {recipe.name}
          </DialogTitle>
          <DialogDescription>
            Отслеживание производства и отгрузок для продукта
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Фильтр по дате (ГГГГ-ММ-ДД)"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="flex gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
              <span>Производство</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
              <span>Отгрузка</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Дата</TableHead>
                <TableHead className="w-[120px]">Операция</TableHead>
                <TableHead className="w-[100px]">Количество</TableHead>
                <TableHead className="w-[120px]">Стоимость/Цена</TableHead>
                <TableHead>Ссылка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Нет данных о движении продукта
                  </TableCell>
                </TableRow>
              ) : (
                movementHistory.map((event, index) => (
                  <TableRow key={`${event.type}-${event.batchId}-${index}`}>
                    <TableCell>
                      {format(new Date(event.date), 'dd.MM.yyyy', { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {event.type === 'production' ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <PackageIcon className="h-4 w-4 text-green-600" />
                            <span>Производство</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <TruckIcon className="h-4 w-4 text-red-600" />
                            <span>Отгрузка</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {event.quantity > 0 ? (
                          <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        <span className={event.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(event.quantity)} {getRecipeUnit(recipe.id)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.unitValue.toFixed(2)} ₽
                      <span className="text-xs text-muted-foreground ml-1">
                        {event.type === 'production' ? '/шт.' : ''}
                      </span>
                    </TableCell>
                    <TableCell>{event.reference}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductMovementHistory;
