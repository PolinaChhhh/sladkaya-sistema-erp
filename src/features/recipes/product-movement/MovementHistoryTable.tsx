
import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  PackageIcon,
  TruckIcon,
  ArrowDownIcon,
  ArrowUpIcon 
} from 'lucide-react';
import { MovementEvent } from './types';
import { Recipe } from '@/store/types';

interface MovementHistoryTableProps {
  movementHistory: MovementEvent[];
  recipe: Recipe;
  getRecipeUnit: (id: string) => string;
}

const MovementHistoryTable: React.FC<MovementHistoryTableProps> = ({ 
  movementHistory,
  recipe,
  getRecipeUnit
}) => {
  return (
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
  );
};

export default MovementHistoryTable;
