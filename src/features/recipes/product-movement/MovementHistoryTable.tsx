
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MovementEvent } from './types';
import { Recipe } from '@/store/types';
import MovementHistoryTableRow from './MovementHistoryTableRow';
import MovementHistoryEmptyRow from './MovementHistoryEmptyRow';

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
  const hasMovements = movementHistory.length > 0;

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
          {!hasMovements ? (
            <MovementHistoryEmptyRow />
          ) : (
            movementHistory.map((event, index) => (
              <MovementHistoryTableRow 
                key={`${event.type}-${event.batchId}-${index}`}
                event={event}
                getRecipeUnit={getRecipeUnit}
                recipeId={recipe.id}
                index={index}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovementHistoryTable;
